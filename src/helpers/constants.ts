export const ENV_REGISTRY_ITEM_PROPS = ['envKey', 'env'];
export const ENV_REGISTRY_ITEM_PROPS_LENGTH = 2;

export const validationMessages = {
  registerRequestIsNotCorrect:
    'registerRequest has not been provided or does not match this pattern: { envKey: string, env: any }',
  envKeyIsNotCorrect: 'envKey has not been provided or it is not a string',
};
