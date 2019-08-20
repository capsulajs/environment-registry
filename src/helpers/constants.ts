export const ENV_REGISTRY_ITEM_PROPS = ['envKey', 'env'];
export const ENV_REGISTRY_ITEM_PROPS_LENGTH = 2;

export const validationMessages = {
  registerRequestIsNotCorrect:
    'registerRequest has not provided or is not matching this pattern: {envKey: string, env: any}',
  envKeyIsNotCorrect: 'envKey has not been provided or is not a string',
};
