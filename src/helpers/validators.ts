import { ENV_REGISTRY_ITEM_PROPS, ENV_REGISTRY_ITEM_PROPS_LENGTH } from './constants';
import { isObject } from './utils';

export const isRegisterRequestValid = (request: any) => {
  const requestKeys = isObject(request) ? Object.keys(request) : [];
  return (
    requestKeys.length === ENV_REGISTRY_ITEM_PROPS_LENGTH &&
    ENV_REGISTRY_ITEM_PROPS.every((prop) => requestKeys.includes(prop))
  );
};

export const isRepositoryValid = (repository: any) => {
  return !(typeof repository !== 'undefined' && (!repository || typeof repository !== 'string' || !repository.trim()));
};

export const isEnvKeyValid = (envKey: any) => typeof envKey === 'string';
