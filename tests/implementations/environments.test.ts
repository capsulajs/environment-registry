import EnvRegistry from '../../src/EnvRegistry';
import {
  ConfigurationServiceLocalStorage
} from '@capsulajs/capsulajs-configuration-service';
import { configurationServiceResponseMock } from './mocks';

describe('Register test suite', () => {
  // TODO import configuration service and mock confService.entries()
  const configurationService = new ConfigurationServiceLocalStorage('token');
  const repository = 'environmentRegistry';
  const envRegistry = new EnvRegistry(configurationService);

  beforeEach(async () => {
    localStorage.clear();
    await configurationService.createRepository({ repository });
    configurationServiceResponseMock.forEach(async ({ key, value }) => {
      await configurationService.save({ repository, key, value })
    });
  });

  it('Subscribe to environments$ method returns all available envKeys and Envs', () => {
    envRegistry.environments$({})
      .subscribe((x) => console.log('X', x));
  });

  it('Server error occurs when subscribing to environments$', () => {});
});
