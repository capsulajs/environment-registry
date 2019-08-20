import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../src';
import { environments } from '../helpers/mocks';
import { validationMessages } from '../../src/helpers/constants';
import { Env } from '../helpers/types';

describe('Register test suite for all the providers except localStorage', () => {
  const tag2Data = { envKey: 'tag-2', env: environments['tag-2'] };

  it('Register is not supported yet for localFile configProvider', () => {
    expect.assertions(1);

    const envRegistryLocalFile = new EnvRegistry<string>({
      token: `${process.cwd()}/tests/helpers/envsLocalFile`,
      configProvider: configurationTypes.localFile,
      repository: 'json',
    });

    return envRegistryLocalFile.register(tag2Data).catch((error) => {
      expect(error).toEqual(new Error(validationMessages.savingIsNotSupported));
    });
  });

  it('Register is not supported yet for httpFile configProvider', () => {
    expect.assertions(1);
    const envRegistryHttpFile = new EnvRegistry<Env>({
      token: 'http://localhost:3000',
      configProvider: configurationTypes.httpFile,
      repository: 'env-repo',
    });
    return envRegistryHttpFile.register(tag2Data).catch((error) => {
      expect(error).toEqual(new Error(validationMessages.savingIsNotSupported));
    });
  });
});
