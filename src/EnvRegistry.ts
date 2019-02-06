import { from } from 'rxjs';
import {
  EnvRegistry as EnvRegistryInterface,
  EnvRegistryItem,
  EnvironmentsRequest,
  EnvironmentsResponse,
  RegisterResponse
} from './api/EnvRegistry';
import { ConfigurationService, ConfigurationServiceLocalStorage } from '@capsulajs/capsulajs-configuration-service';

export default class EnvRegistry implements EnvRegistryInterface{
  configurationService: ConfigurationService;

  constructor(private token: string) {
    this.configurationService = new ConfigurationServiceLocalStorage(token); // add logic to choose specific provider
    this.configurationService.createRepository({ repository: 'environmentRegistry' })
      .then() // look for Promise in constructor behavior
      .catch(); // catch specific Error(messages.repositoryAlreadyExists
  }

  public register(registerRequest: EnvRegistryItem): Promise<RegisterResponse> {
    console.log(`REGISTER req: ${registerRequest}`);
    // Add some validation here
    return this.configurationService.save({
      repository: 'environmentRegistry',
      key: registerRequest.envKey,
      value: registerRequest.env
    });
  }

  public environments$(environmentsRequest: EnvironmentsRequest): EnvironmentsResponse {
    let entries: Array<any> = [];
    this.configurationService.entries({ repository: 'environmentRegistry'})
      .then((response) => {
        entries = response.entries.map((conf) => ({ envKey: conf.key, env: conf.value }));
        console.log(`ENTRIES resp: ${entries}`);
      });

    return from(entries);
  }
}
