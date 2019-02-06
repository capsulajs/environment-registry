import EnvRegistry from '../../src/EnvRegistry';
import {
  ConfigurationServiceLocalStorage
} from '@capsulajs/capsulajs-configuration-service';
import { configurationServiceResponseMock } from './mocks';

describe('Register test suite', () => {
  const configurationService = new ConfigurationServiceLocalStorage('token');
  const repository = 'environmentRegistry';
  const envRegistry = new EnvRegistry(configurationService);
  
  beforeEach(async () => {
    localStorage.clear();
    await configurationService.createRepository({ repository });
    configurationServiceResponseMock.map(async ({ key, value }) => {
      console.log('SAVE', key, value, await configurationService.save({ repository, key, value }));
      console.log('FETCH', await configurationService.fetch({ repository, key }));
    });
  });

  it('Subscribe to environments$ method returns all available envKeys and Envs', async () => {
    console.log('START');
    console.log('ENTRIES', await configurationService.entries({ repository }));
    
    envRegistry.environments$({})
      .subscribe((x) => console.log('X', x));
  });

  // it('Server error occurs when subscribing to environments$', () => {});
});
