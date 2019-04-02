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
import { isEnvKeyValid, isEnvValid, isRegisterRequestValid } from './helpers/validators';
import { ConfigEntry, EntriesResponse } from './types';
import { validationMessages } from './helpers/constants';

export class EnvRegistry implements EnvRegistryInterface {
  private configurationService: ConfigurationService;
  private repositoryCreated: boolean;
  private readonly repository: string;

  constructor(token: string) {
    this.configurationService = new ConfigurationServiceLocalStorage(token); // add logic to choose specific provider
    this.repositoryCreated = false;
    this.repository = 'environmentRegistry';
  }

  public async register(registerRequest: EnvRegistryItem): Promise<RegisterResponse> {
    if (!isRegisterRequestValid(registerRequest)) {
      return Promise.reject(new Error(validationMessages.registerRequestIsNotCorrect));
    }
    const { envKey, env } = registerRequest;
    if (!isEnvKeyValid(envKey)) {
      return Promise.reject(new Error(validationMessages.envKeyIsNotCorrect));
    }
    if (!isEnvValid(env)) {
      return Promise.reject(new Error(validationMessages.envIsNotCorrect));
    }

    if (!this.repositoryCreated) {
      try {
        await this.createRepository();
        this.repositoryCreated = true;
      } catch (e) {
        if (e.message === messages.repositoryAlreadyExists) {
          this.repositoryCreated = true;
        } else {
          return Promise.reject(new Error(e));
        }
      }
    }
    return this.save({ key: envKey, value: env });
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
