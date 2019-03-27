import { Env, EnvService, EnvServiceMethod, EnvServiceMethods } from '../api/Env';
import { EnvRegistryItem } from '../api/EnvRegistry';
import {
  ENV_REGISTRY_ENV_METHOD_PROPS_LENGTH,
  ENV_REGISTRY_ENV_PROPS_LENGTH,
  ENV_REGISTRY_ENV_SERVICE_PROPS_LENGTH,
  ENV_REGISTRY_ITEM_PROPS,
  ENV_REGISTRY_ITEM_PROPS_LENGTH,
  ENV_REGISTRY_VALID_ASYNC_MODEL,
} from './constants';
import { isObject } from './utils';

export const isRegisterRequestValid = (request: EnvRegistryItem) => {
  const requestKeys = isObject(request) ? Object.keys(request) : [];
  return (
    requestKeys.length === ENV_REGISTRY_ITEM_PROPS_LENGTH &&
    ENV_REGISTRY_ITEM_PROPS.every((prop) => requestKeys.includes(prop))
  );
};

export const isEnvKeyValid = (envKey: string) => typeof envKey === 'string';

export const isEnvValid = (env: Env) =>
  isObject(env) &&
  Object.keys(env).length === ENV_REGISTRY_ENV_PROPS_LENGTH &&
  env.services &&
  isEnvServiceValid(env.services);

const isEnvServiceValid = (services: EnvService[]) =>
  services.every(
    (service) =>
      isObject(service) &&
      Object.keys(service).length === ENV_REGISTRY_ENV_SERVICE_PROPS_LENGTH &&
      isEnvServiceNameValid(service.serviceName) &&
      isEnvUrlValid(service.url) &&
      isEnvMethodsValid(service.methods)
  );

const isEnvServiceNameValid = (serviceName: string): boolean => typeof serviceName === 'string';
const isEnvUrlValid = (url: string): boolean => typeof url === 'string';
const isEnvMethodsValid = (methods: EnvServiceMethods) =>
  isObject(methods) && Object.values(methods).every(isEnvMethodValid);

const isEnvMethodValid = (method: EnvServiceMethod) =>
  isObject(method) &&
  Object.keys(method).length === ENV_REGISTRY_ENV_METHOD_PROPS_LENGTH &&
  method.asyncModel &&
  ENV_REGISTRY_VALID_ASYNC_MODEL.includes(method.asyncModel);
