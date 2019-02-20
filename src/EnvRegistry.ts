import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  ConfigurationService,
  ConfigurationServiceLocalStorage,
  messages,
} from '@capsulajs/capsulajs-configuration-service';
import {
  EnvRegistry as EnvRegistryInterface,
  EnvRegistryItem,
  EnvironmentsRequest,
  EnvironmentsResponse,
  RegisterResponse,
} from './api/EnvRegistry';
import { envKeyValidator, envValidator, validationMessages } from './utils';
import { ConfigEntry, EntriesResponse } from './types';

export default class EnvRegistry implements EnvRegistryInterface {
  private configurationService: ConfigurationService;
  private repositoryCreated: boolean;
  private readonly repository: string;

  constructor(token: string) {
    this.configurationService = new ConfigurationServiceLocalStorage(token); // add logic to choose specific provider
    this.repositoryCreated = false;
    this.repository = 'environmentRegistry';
  }

  public async register(registerRequest: EnvRegistryItem): Promise<RegisterResponse> {
    if (!envValidator(registerRequest)) {
      return Promise.reject(new Error(validationMessages.envIsNotCorrect));
    }
    if (!envKeyValidator(registerRequest)) {
      return Promise.reject(new Error(validationMessages.envKeyIsNotCorrect));
    }

    if (!this.repositoryCreated) {
      try {
        await this.createRepository();
        this.repositoryCreated = true;
      } catch (e) {
        e.message === messages.repositoryAlreadyExists ? (this.repositoryCreated = true) : new Error(e);
      }
    }
    return this.save({ key: registerRequest.envKey, value: registerRequest.env });
  }

  public environments$(environmentsRequest: EnvironmentsRequest): EnvironmentsResponse {
    return from(this.configurationService.entries({ repository: this.repository })).pipe(
      switchMap((response: EntriesResponse) => {
        return from(response.entries.map((entry) => ({ envKey: entry.key, env: entry.value })));
      })
    );
  }

  private save(params: ConfigEntry) {
    return this.configurationService.save({ repository: this.repository, key: params.key, value: params.value });
  }

  private createRepository() {
    return this.configurationService.createRepository({ repository: this.repository });
  }
}
