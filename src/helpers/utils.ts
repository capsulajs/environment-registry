import { API as CONFIGURATION_SERVICE_API, ConfigurationService } from '@capsulajs/capsulajs-configuration-service';
import { AxiosDispatcher } from '@capsulajs/capsulajs-transport-providers';
import { validationMessages } from './constants';

export const isObject = (obj: object) => obj && typeof obj === 'object' && obj.constructor === Object;

export const getConfigurationService = <Env>(
  token: string,
  ConfigurationServiceClass: CONFIGURATION_SERVICE_API.ConfigurationProviderClass,
  dispatcherUrl?: string
): ConfigurationService<Env> => {
  if (typeof dispatcherUrl !== 'undefined' && (typeof dispatcherUrl !== 'string' || !dispatcherUrl.trim())) {
    throw new Error(validationMessages.dispatcherUrlIsNotCorrect);
  }

  const args: [string, AxiosDispatcher?] = [token];
  if (dispatcherUrl) {
    args.push(new AxiosDispatcher(dispatcherUrl));
  }

  return new ConfigurationServiceClass(...args);
};
