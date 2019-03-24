import { EnvService, EnvServiceMethod, EnvServiceMethods } from './api/Env';

export const isRegisterRequestValid = (request: any) => {
  const props = ['envKey', 'env'];
  return !(
    !request ||
    Object.entries(request).length !== 2 ||
    !props.every((p) => Object.getOwnPropertyNames(request).includes(p))
  );
};

export const isEnvKeyValid = (request: any) => typeof request.envKey === 'string';

export const isEnvValid = (request: any) =>
  Object.entries(request.env).length === 1 && request.env.services && isEnvServiceValid(request.env.services);

const isEnvServiceValid = (services: EnvService[]) =>
  services.every(
    (service) =>
      service.constructor === Object &&
      Object.entries(service).length === 3 &&
      !(!service.serviceName || !isEnvServiceNameValid(service.serviceName)) &&
      !(!service.url || !isEnvUrlValid(service.url)) &&
      !(!service.methods || !isEnvMethodsValid(service.methods))
  );

const isEnvServiceNameValid = (serviceName: string) => serviceName && typeof serviceName === 'string';
const isEnvUrlValid = (url: string) => url && typeof url === 'string';
const isEnvMethodsValid = (methods: EnvServiceMethods) => {
  let isValid = true;
  if (methods.constructor !== Object) {
    isValid = false;
  } else {
    Object.entries(methods).forEach((method) => {
      if (!method[1] || method[1].constructor !== Object || !isEnvMethodValid(method[1])) {
        isValid = false;
      }
    });
  }
  return isValid;
};

const isEnvMethodValid = (method: EnvServiceMethod) =>
  Object.entries(method).length === 1 &&
  method.asyncModel &&
  (method.asyncModel === 'RequestResponse' || method.asyncModel === 'RequestStream');

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
