import { Observable } from 'rxjs';
import { Env } from './Env';

/**
 * EnvRegistry provides public methods to manage different versions of projects in CapsulaHub.
 */
export default interface EnvRegistry {
  /**
   * Provides a way to save environment.
   * This method require a key and an Env.
   *
   * @return Promise resolved when the registration has been completed
   */
  register: (envKey, env: Env) => Promise<undefined>,

  /**
   * Provides information about the registered environments (key, array of urls).
   *
   * @return An Observable sequence containing the registered environments.
   */
  environments$: (envRegistryRequest: EnvRegistryRequest) => Observable<EnvRegistryResponse>,
}

export interface EnvRegistryRequest {}

export interface EnvRegistryResponse {
  key: string,
  env: Env,
}
