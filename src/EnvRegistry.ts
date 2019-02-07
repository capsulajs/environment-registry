import { from, Observable, Subject } from 'rxjs';
import {
  EnvRegistry as EnvRegistryInterface,
  EnvRegistryItem,
  EnvironmentsRequest,
  EnvironmentsResponse,
  RegisterResponse
} from './api/EnvRegistry';
import { ConfigurationService, ConfigurationServiceLocalStorage } from '@capsulajs/capsulajs-configuration-service';
import { Env } from './api/Env';
import { messages } from '@capsulajs/capsulajs-configuration-service/lib/utils';
import { envKeyValidator, envValidator, validationMessages } from './utils';
import { switchMap } from 'rxjs/operators';

export default class EnvRegistry implements EnvRegistryInterface{
  configurationService: ConfigurationService;
  repositoryCreated: boolean;
  environmentsSubject$: Subject<any>;

  constructor(private token: string) {
    this.configurationService = new ConfigurationServiceLocalStorage(token); // add logic to choose specific provider
    this.repositoryCreated = false;
    this.environmentsSubject$ = new Subject();
  }

  private save(key: string, value: Env) {
    return this.configurationService.save({ repository: 'environmentRegistry', key, value });
  };

  public async register(registerRequest: EnvRegistryItem): Promise<RegisterResponse> {
    if (!envValidator(registerRequest)) return Promise.reject(new Error(validationMessages.envIsNotCorrect));
    if (!envKeyValidator(registerRequest)) return Promise.reject(new Error(validationMessages.envKeyIsNotCorrect));

    if (!this.repositoryCreated) {
      try {
        await this.configurationService.createRepository({ repository: 'environmentRegistry' });
        this.repositoryCreated = true;
      } catch(e) {
        this.repositoryCreated = e.message === messages.repositoryAlreadyExists ;
      }
    }
    return this.save(registerRequest.envKey, registerRequest.env);
  }

  public environments$(environmentsRequest: EnvironmentsRequest): EnvironmentsResponse {
    // return Observable.create((obs: any )=> {
    //   let entries: Array<any> = [];
    //   this.configurationService.entries({ repository: 'environmentRegistry'})
    //     .then((response) => {
    //       entries = response.entries.map((conf) => ({ envKey: conf.key, env: conf.value }));
    //       console.log(`ENTRIES resp: ${entries}`);
    //     })
    //     .catch(error => console.log(error));
    //
    //   obs.next(entries);
    //
    // });

    // const response = await this.configurationService.entries({ repository: 'environmentRegistry'});
    //
    // const entries = response.entries.map((conf) => ({ envKey: conf.key, env: conf.value }));
    // console.log(`ENTRIES resp: ${entries}`);
    //
    // return from(entries);

    return from(this.configurationService.entries({ repository: 'environmentRegistry'}))
      .pipe(switchMap((response: any) => from(response.entries)));
  }
}
