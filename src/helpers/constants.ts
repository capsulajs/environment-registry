export const ENV_REGISTRY_ITEM_PROPS = ['envKey', 'env'];
export const ENV_REGISTRY_ITEM_PROPS_LENGTH = 2;

export const validationMessages = {
  registerRequestIsNotCorrect:
    'registerRequest not provided or not matching this pattern: { envKey: string, env: any }',
  envKeyIsNotCorrect: 'envKey has not been provided or it is not a string',
  dispatcherUrlIsNotCorrect: 'dispatcherUrl was provided, but was not a non-empty string',
  repositoryIsNotCorrect: 'repository was provided, but was not a non-empty string',
  savingIsNotSupported: 'saving is not supported in the current ConfigurationProvider',
};

export const defaultRepository = 'environmentRegistry';
