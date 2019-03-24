export interface Env {
  /** Env services is an Array of url */
  services: EnvService[];
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
  [methodName: string]: EnvServiceMethod;
}

export interface EnvServiceMethod {
  asyncModel: AsyncModelType;
}

export type AsyncModelType = 'RequestResponse' | 'RequestStream';
