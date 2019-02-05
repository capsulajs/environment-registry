import { Observable } from 'rxjs';
import { Env } from './Env';
import { SaveResponse } from '@capsulajs/capsulajs-configuration-service/lib/api';

/**
 * EnvRegistry provides public methods to manage different versions of projects in CapsulaHub.
 */
export interface EnvRegistry {
  /**
   * Provides a way to save environment.
   * This method require a key and an Env.
   *
   * @return Promise resolved when the registration has been completed
   */
  register: (envKey: string, env: Env) => Promise<SaveResponse>;

  /**
   * Provides information about the registered environments (key, array of urls).
   *
   * @return An Observable sequence containing the registered environments.
   */
  environments$: (envRegistryRequest: EnvRegistryRequest) => EnvRegistryResponse;
}

export interface EnvRegistryRequest {}

interface EnvRegistryItem {
  env: Env;
  envKey: string;
}

export type EnvRegistryResponse = Observable<EnvRegistryItem>;
