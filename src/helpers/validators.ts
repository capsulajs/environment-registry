import { EnvService, EnvServiceMethod, EnvServiceMethods } from '../api/Env';
import { EnvRegistryItem } from '../api/EnvRegistry';
import {
  ENV_REGISTRY_ENV_METHOD_PROPS_LENGTH,
  ENV_REGISTRY_ENV_PROPS_LENGTH,
  ENV_REGISTRY_ENV_SERVICE_PROPS_LENGTH,
  ENV_REGISTRY_ITEM_PROPS,
  ENV_REGISTRY_ITEM_PROPS_LENGTH,
  ENV_REGISTRY_VALID_ASYNC_MODEL,
} from './constants';

export const isRegisterRequestValid = (request: EnvRegistryItem) => {
  const requestKeys = Object.keys(request);
  return (
    request &&
    requestKeys.length === ENV_REGISTRY_ITEM_PROPS_LENGTH &&
    ENV_REGISTRY_ITEM_PROPS.every((p) => requestKeys.includes(p))
  );
};

export const isEnvKeyValid = (request: EnvRegistryItem) => typeof request.envKey === 'string';

export const isEnvValid = (request: EnvRegistryItem) =>
  request.env &&
  request.env.constructor === Object &&
  Object.entries(request.env).length === ENV_REGISTRY_ENV_PROPS_LENGTH &&
  request.env.services &&
  isEnvServiceValid(request.env.services);

const isEnvServiceValid = (services: EnvService[]) =>
  services.every(
    (service) =>
      service.constructor === Object &&
      Object.keys(service).length === ENV_REGISTRY_ENV_SERVICE_PROPS_LENGTH &&
      isEnvServiceNameValid(service.serviceName) &&
      isEnvUrlValid(service.url) &&
      isEnvMethodsValid(service.methods)
  );

const isEnvServiceNameValid = (serviceName: string): boolean => typeof serviceName === 'string';
const isEnvUrlValid = (url: string): boolean => typeof url === 'string';
const isEnvMethodsValid = (methods: EnvServiceMethods) =>
  methods && methods.constructor === Object && Object.values(methods).every(isEnvMethodValid);

const isEnvMethodValid = (method: EnvServiceMethod) =>
  method &&
  method.constructor === Object &&
  Object.keys(method).length === ENV_REGISTRY_ENV_METHOD_PROPS_LENGTH &&
  method.asyncModel &&
  ENV_REGISTRY_VALID_ASYNC_MODEL.includes(method.asyncModel);
