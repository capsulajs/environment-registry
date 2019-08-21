import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { tag2Data, baseUrl, baseRepository } from '../../helpers/mocks';
import { Env } from '../../helpers/types';
import { validationMessages } from '../../../src/helpers/constants';

describe('Register test suite (httpServer provider)', () => {
  it('Calling register sends the correct data to http server', () => {
    expect.assertions(1);
    const envRegistry = new EnvRegistry<Env>({
      token: baseUrl,
      configProvider: configurationTypes.httpServer,
      repository: baseRepository,
    });
    return envRegistry.register(tag2Data).catch((error) => {
      expect(error).toEqual(new Error(validationMessages.savingIsNotSupported));
    });
  });
});
