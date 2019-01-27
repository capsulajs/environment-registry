import { Observable } from 'rxjs';
import { Env } from './Env';

export default interface EnvRegistryDefinition {
  register: (envKey, env: Env) => Promise<undefined>,
  environments$: (envRegistryRequest: EnvRegistryRequest) => Observable<EnvRegistryResponse>,
}

export interface EnvRegistryRequest {}

export interface EnvRegistryResponse {
  key: string,
  env: Env,
}
