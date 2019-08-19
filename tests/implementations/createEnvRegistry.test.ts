import * as configurationServiceItems from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistryOptions } from '../../src/api/EnvRegistryOptions';
import { EnvRegistry } from '../../src';

describe('Create EnvRegistry with available configProvider and valid token', () => {
  const getConfigurationServiceClassSpy = jest.spyOn(configurationServiceItems, 'getProvider');
  const token = 'token';
  const invalidArgs = [' ', {}, { test: 'test' }, [], ['test'], null, true, false, 0, -1];

  beforeEach(() => {
    getConfigurationServiceClassSpy.mockClear();
  });

  test.each`
    configProvider                                                    | configurationServiceClassName
    ${`${configurationServiceItems.configurationTypes.localStorage}`} | ${'ConfigurationServiceLocalStorage'}
    ${`${configurationServiceItems.configurationTypes.localFile}`}    | ${'ConfigurationServiceFile'}
    ${`${configurationServiceItems.configurationTypes.httpFile}`}     | ${'ConfigurationServiceHttpFile'}
    ${`${configurationServiceItems.configurationTypes.scalecube}`}    | ${'ConfigurationServiceScalecube'}
    ${`${configurationServiceItems.configurationTypes.httpServer}`}   | ${'ConfigurationServiceHttp'}
  `(
    'Create EnvRegistry with available configProvider and valid token: $configurationType:' +
      ' $configurationServiceClassName',
    ({ configProvider, configurationServiceClassName }) => {
      expect.assertions(2);
      const envRegistryOptions: EnvRegistryOptions = { token, configProvider };
      if (configProvider === configurationServiceItems.configurationTypes.scalecube) {
        envRegistryOptions.dispatcherUrl = 'http://localhost:3000';
      }
      const envRegistry = new EnvRegistry(envRegistryOptions);
      expect(envRegistry instanceof EnvRegistry).toBeTruthy();
      expect(getConfigurationServiceClassSpy.mock.results[0].value.name).toBe(configurationServiceClassName);
    }
  );

  it('Create EnvRegistry without configProvider - default configProvider is used', () => {
    expect.assertions(2);
    const envRegistry = new EnvRegistry({ token });
    expect(envRegistry instanceof EnvRegistry).toBeTruthy();
    expect(getConfigurationServiceClassSpy.mock.results[0].value.name).toBe('ConfigurationServiceHttpFile');
  });

  it('Create EnvRegistry with non-existent configProvider throws an error', () => {
    expect.assertions(1);
    try {
      // @ts-ignore
      new EnvRegistry({ token, configProvider: 'nonExistent' });
    } catch (error) {
      expect(error).toEqual(new Error(configurationServiceItems.messages.configProviderDoesNotExist));
    }
  });

  it('Create EnvRegistry with invalid value of configProvider', () => {
    expect.assertions(10);
    invalidArgs.forEach((configProvider) => {
      try {
        // @ts-ignore
        new EnvRegistry({ token, configProvider });
      } catch (error) {
        expect(error).toEqual(
          new Error(
            configProvider
              ? configurationServiceItems.messages.configProviderDoesNotExist
              : configurationServiceItems.messages.getProviderInvalidRequest
          )
        );
      }
    });
  });

  it('Create EnvRegistry with a token with invalid format', () => {
    expect.assertions(11);
    [...invalidArgs, undefined].forEach((token) => {
      try {
        // @ts-ignore
        new EnvRegistry({ token, configProvider: configurationServiceItems.configurationTypes.httpFile });
      } catch (error) {
        expect(error).toEqual(new Error(configurationServiceItems.messages.tokenNotProvided));
      }
    });
  });

  it('Create EnvRegistry with invalid value of dispatcherUrl', () => {
    // expect.assertions(10);
    [invalidArgs].forEach((dispatcherUrl) => {
      try {
        // @ts-ignore
        new EnvRegistry({
          token,
          dispatcherUrl,
          configProvider: configurationServiceItems.configurationTypes.scalecube,
        });
      } catch (error) {
        console.log('error', error);
        // expect(error).toEqual(new Error(configurationServiceItems.messages.));
      }
    });
  });
});
