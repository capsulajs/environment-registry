import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { messages } from '@capsulajs/capsulajs-configuration-service/lib/utils';
import { ConfigurationService, ConfigurationServiceLocalStorage } from '@capsulajs/capsulajs-configuration-service';
import {
  EnvRegistry as EnvRegistryInterface,
  EnvRegistryItem,
  EnvironmentsRequest,
  EnvironmentsResponse,
  RegisterResponse
} from './api/EnvRegistry';
import { Env } from './api/Env';
import { envKeyValidator, envValidator, validationMessages } from './utils';

export default class EnvRegistry implements EnvRegistryInterface{
  configurationService: ConfigurationService;
  repositoryCreated: boolean;
  repository: string;

  constructor(private token: string) {
    this.configurationService = new ConfigurationServiceLocalStorage(token); // add logic to choose specific provider
    this.repositoryCreated = false;
    this.repository = 'environmentRegistry';
  }

  private save(key: string, value: Env) {
    return this.configurationService.save({ repository: this.repository, key, value });
  };

  public async register(registerRequest: EnvRegistryItem): Promise<RegisterResponse> {
    if (!envValidator(registerRequest)) return Promise.reject(new Error(validationMessages.envIsNotCorrect));
    if (!envKeyValidator(registerRequest)) return Promise.reject(new Error(validationMessages.envKeyIsNotCorrect));

    if (!this.repositoryCreated) {
      try {
        await this.configurationService.createRepository({ repository: this.repository });
        this.repositoryCreated = true;
      } catch(e) {
        this.repositoryCreated = e.message === messages.repositoryAlreadyExists ;
      }
    }
    return this.save(registerRequest.envKey, registerRequest.env);
  }

  public environments$(environmentsRequest: EnvironmentsRequest): EnvironmentsResponse {
    return from(this.configurationService.entries({ repository: this.repository}))
      .pipe(switchMap((response: any) => from(response.entries)));
  }
}
