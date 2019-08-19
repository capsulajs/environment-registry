export const ENV_REGISTRY_ITEM_PROPS = ['envKey', 'env'];
export const ENV_REGISTRY_ITEM_PROPS_LENGTH = 2;

export const validationMessages = {
  registerRequestIsNotCorrect:
    'registerRequest not provided or not matching this pattern: { envKey: string, env: any }',
  envKeyIsNotCorrect: 'envKey was not provided or is not a string',
  dispatcherUrlIsNotCorrect: 'dispatcherUrl was provided, but was not a non-empty string',
};

export const defaultRepository = 'environmentRegistry';
