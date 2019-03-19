import { EnvService, EnvServiceMethods } from './api/Env';

export const isEnvKeyValid = (request: any) => request && request.envKey && typeof request.envKey === 'string';

export const isEnvValid = (request: any) => {
  return request && request.env && request.env.services && isEnvServiceValid(request.env.services);
};

const isEnvServiceValid = (services: EnvService[]) => {
  let isValid = true;
  if (services.length === 0) {
    isValid = false;
  } else {
    services.forEach((service) => {
      if (!service.serviceName || !isEnvServiceNameValid(service.serviceName)) {
        isValid = false;
      }
      if (!service.url || !isEnvUrlValid(service.url)) {
        isValid = false;
      }
      if (!service.methods || !isEnvMethodsValid(service.methods)) {
        isValid = false;
      }
    });
  }
  return isValid;
};

const isEnvServiceNameValid = (serviceName: string) => serviceName && typeof serviceName === 'string';
const isEnvUrlValid = (url: string) => url && typeof url === 'string';
const isEnvMethodsValid = (methods: EnvServiceMethods) => {
  let isValid = true;
  if (methods.constructor !== Object) {
    isValid = false;
  } else {
    Object.entries(methods).forEach((method) => {
      if (method[1] && method[1].asyncModel !== 'RequestResponse' && method[1].asyncModel !== 'RequestStream') {
        isValid = false;
      }
    });
  }
  return isValid;
};

export const validationMessages = {
  envKeyIsNotCorrect: 'envKey was not provided or is not a string',
  envIsNotCorrect:
    "env was not provided or doesn't match this pattern: { services: { serviceName: string, url: string, methods: {} }[] }",
  envServiceNameIsNotCorrect: 'env serviceName should be a string',
  envServiceUrlIsNotCorrect: 'env url should be a string',
  asyncModelTypeIsNotCorrect: 'env service method asyncModel should be "Promise" or "Observable"',
};
