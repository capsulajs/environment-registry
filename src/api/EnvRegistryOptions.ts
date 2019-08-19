import { API } from '@capsulajs/capsulajs-configuration-service';

export interface EnvRegistryOptions {
  /** Token used to get environments data */
  token: string;
  /**
   * The type of configuration provider, that will be used to get environments data
   * Possible values: "localFile","httpFile","scalecube","httpServer","localStorage"
   * @default "httpFile"
   */
  configProvider?: API.ConfigurationProvider;
  /**
   * Dispatcher url, that will be used in "scalecube" config provider
   */
  dispatcherUrl?: string;
  /**
   * The name of the repository, that is used to get entries from ConfigurationService
   * @default environmentRegistry
   */
  repository?: string;
}
