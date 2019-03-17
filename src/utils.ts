import { EnvService, EnvServiceMethods } from './api/Env';

export const isEnvKeyValid = (request: any) => request && request.envKey && typeof request.envKey === 'string';

export const isEnvValid = (request: any) => {
  return request && request.env && request.env.services && isEnvServiceValid(request.env.services[0]);
};

const isEnvServiceValid = (service: EnvService) => {
  let isValid = true;
  if (!service.serviceName || !isEnvServiceNameValid(service.serviceName)) {
    console.error(validationMessages.envServiceNameIsNotCorrect);
    isValid = false;
  }
  if (!service.url || !isEnvUrlValid(service.url)) {
    console.error(validationMessages.envServiceUrlIsNotCorrect);
    isValid = false;
  }
  if (!service.methods || !isEnvMethodsValid(service.methods)) {
    isValid = false;
  }
  return isValid;
};

const isEnvServiceNameValid = (serviceName: string) => serviceName && typeof serviceName === 'string';
const isEnvUrlValid = (url: string) => url && typeof url === 'string';
const isEnvMethodsValid = (methods: EnvServiceMethods) => {
  let isValid = true;
  if (Object.entries(methods).length === 0) {
    isValid = false;
    console.error(validationMessages.envServiceMethodsIsNotCorrect);
  } else {
    Object.entries(methods).forEach((method) => {
      if (method[1].asyncModel !== 'Promise' && method[1].asyncModel !== 'Observable') {
        isValid = false;
        console.error(validationMessages.asyncModelTypeIsNotCorrect);
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
  envServiceMethodsIsNotCorrect:
    'env methods should contain at least one property with value "Promise" or "Observable"',
  asyncModelTypeIsNotCorrect: 'env service method asyncModel should be "Promise" or "Observable"',
};
