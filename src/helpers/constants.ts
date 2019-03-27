export const ENV_REGISTRY_ITEM_PROPS = ['envKey', 'env'];
export const ENV_REGISTRY_ITEM_PROPS_LENGTH = 2;
export const ENV_REGISTRY_ENV_PROPS_LENGTH = 1;
export const ENV_REGISTRY_ENV_SERVICE_PROPS_LENGTH = 3;
export const ENV_REGISTRY_ENV_METHOD_PROPS_LENGTH = 1;

export const ENV_REGISTRY_ASYNC_MODEL_RESPONSE = 'RequestResponse';
export const ENV_REGISTRY_ASYNC_MODEL_STREAM = 'RequestStream';
export const ENV_REGISTRY_VALID_ASYNC_MODEL: string[] = [
  ENV_REGISTRY_ASYNC_MODEL_RESPONSE,
  ENV_REGISTRY_ASYNC_MODEL_STREAM,
];

export const validationMessages = {
  registerRequestIsNotCorrect:
    'registerRequest not provided or not matching this pattern: { envKey: string, env: Env }',
  envKeyIsNotCorrect: 'envKey was not provided or is not a string',
  envIsNotCorrect:
    "env was not provided or doesn't match this pattern: { services: { serviceName: string, url: string, methods: {} }[] }",
  envServiceNameIsNotCorrect: 'env serviceName should be a string',
  envServiceUrlIsNotCorrect: 'env url should be a string',
  asyncModelTypeIsNotCorrect: 'env service method asyncModel should be "Promise" or "Observable"',
};
