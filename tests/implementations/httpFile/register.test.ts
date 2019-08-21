import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { tag2Data, baseUrl, baseRepository } from '../../helpers/mocks';
import { validationMessages } from '../../../src/helpers/constants';
import { Env } from '../../helpers/types';

describe('Register test suite (httpFile provider)', () => {
  it('Register is not supported yet for httpFile configProvider', () => {
    expect.assertions(1);
    const envRegistry = new EnvRegistry<Env>({
      token: baseUrl,
      configProvider: configurationTypes.httpFile,
      repository: baseRepository,
    });
    return envRegistry.register(tag2Data).catch((error) => {
      expect(error).toEqual(new Error(validationMessages.savingIsNotSupported));
    });
  });
});
