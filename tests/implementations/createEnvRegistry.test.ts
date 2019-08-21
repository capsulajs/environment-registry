import * as configurationServiceItems from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistryOptions } from '../../src/api/EnvRegistryOptions';
import { EnvRegistry } from '../../src';
import { defaultRepository, validationMessages } from '../../src/helpers/constants';
import { baseUrl, baseRepository, baseApiKey } from '../helpers/mocks';

describe('Create EnvRegistry with available configProvider and valid token', () => {
  const getConfigurationServiceClassSpy = jest.spyOn(configurationServiceItems, 'getProvider');
  const token = baseApiKey;
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
        envRegistryOptions.dispatcherUrl = baseUrl;
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
    [...invalidArgs, undefined].forEach((invalidToken) => {
      try {
        // @ts-ignore
        new EnvRegistry({ token: invalidToken, configProvider: configurationServiceItems.configurationTypes.httpFile });
      } catch (error) {
        expect(error).toEqual(new Error(configurationServiceItems.messages.tokenNotProvided));
      }
    });
  });

  it('Create EnvRegistry with invalid value of dispatcherUrl', () => {
    expect.assertions(10);
    invalidArgs.forEach((dispatcherUrl) => {
      try {
        // @ts-ignore
        new EnvRegistry({
          token,
          // @ts-ignore
          dispatcherUrl,
          configProvider: configurationServiceItems.configurationTypes.scalecube,
        });
      } catch (error) {
        expect(error).toEqual(new Error(validationMessages.dispatcherUrlIsNotCorrect));
      }
    });
  });

  it('Create EnvRegistry with invalid value of repository', () => {
    expect.assertions(10);
    invalidArgs.forEach((repository) => {
      try {
        new EnvRegistry({
          token,
          // @ts-ignore
          repository,
        });
      } catch (error) {
        expect(error).toEqual(new Error(validationMessages.repositoryIsNotCorrect));
      }
    });
  });

  it('Repository is applied correctly while the creation of envRegistry', async () => {
    expect.assertions(2);
    const envRegistry = new EnvRegistry<{ name: string }>({
      token,
      configProvider: configurationServiceItems.configurationTypes.localStorage,
      repository: baseRepository,
    });
    await envRegistry.register({ env: { name: 'testEnv' }, envKey: 'testEnv' });
    expect(localStorage.getItem(`${token}.${baseRepository}`)).toBe('{"testEnv":{"name":"testEnv"}}');
    expect(localStorage.getItem(`${token}.${defaultRepository}`)).toBe(null);
  });

  it('Default repository is applied correctly while the creation of envRegistry, if no repository is provided', async () => {
    expect.assertions(1);
    const envRegistry = new EnvRegistry<{ name: string }>({
      token,
      configProvider: configurationServiceItems.configurationTypes.localStorage,
    });
    await envRegistry.register({ env: { name: 'testEnv' }, envKey: 'testEnv' });
    expect(localStorage.getItem(`${token}.${defaultRepository}`)).toBe('{"testEnv":{"name":"testEnv"}}');
  });
});
