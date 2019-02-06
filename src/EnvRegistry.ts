import {
  EnvRegistry as EnvRegistryInterface,
  EnvRegistryRequest,
  EnvRegistryResponse
} from './api/EnvRegistry';
import { Env } from './api/Env';
import { ConfigurationService } from '@capsulajs/capsulajs-configuration-service';
import { from } from 'rxjs';
import { SaveResponse } from '@capsulajs/capsulajs-configuration-service/lib/api';

export default class EnvRegistry implements EnvRegistryInterface{
  constructor(private configurationService: ConfigurationService) {}

  public register(envKey: string, env: Env): Promise<SaveResponse> {
    return this.configurationService.save({ repository: 'environmentRegistry', key: envKey, value: env });
  }

  public environments$(envRegistryRequest: EnvRegistryRequest): EnvRegistryResponse {
    let entries: Array<any> = [];
    this.configurationService.entries({ repository: 'environmentRegistry'}).then((response) => {
      entries = response.entries.map((conf) => ({ envKey: conf.key, env: conf.value }));
      console.log('entries', entries);
    });
    return from(entries);
  }
}
