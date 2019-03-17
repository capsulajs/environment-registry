export interface Env {
  /** Env services is an Array of url */
  services: Array<EnvService>;
}

export interface EnvService {
  /** The service name */
  serviceName: string;
  /** The url gives access to a specific version of a project */
  url: string;
  /** Methods is an object which describes methods are available in a given service */
  methods: EnvServiceMethods;
}

export interface EnvServiceMethods {
  [methodName: string]: { asyncModel: AsyncModelType };
}

type AsyncModelType = 'Promise' | 'Observable';
