import { Observable } from 'rxjs';

/**
 * @interface EnvRegistry
 * EnvRegistry provides public methods to manage different versions of projects in CapsulaHub.
 */
export interface EnvRegistry<Env> {
  /**
   * @method register
   * Provides a way to save environment.
   * This method require a key and an environment.
   *
   * @return Promise resolved when the registration has been completed
   */
  register: (registerRequest: EnvRegistryItem<Env>) => Promise<RegisterResponse>;

  /**
   * @method environments$
   * Provides information about the registered environments (key, array of urls).
   *
   * @return An Observable sequence containing the registered environments.
   */
  environments$: (environmentsRequest: EnvironmentsRequest) => EnvironmentsResponse<Env>;
}

export interface EnvRegistryItem<Env> {
  env: Env;
  envKey: string;
}

export interface RegisterResponse {}

export interface EnvironmentsRequest {}

export type EnvironmentsResponse<Env> = Observable<EnvRegistryItem<Env>>;
