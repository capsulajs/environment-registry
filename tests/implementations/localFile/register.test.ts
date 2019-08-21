import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { tag2Data } from '../../helpers/mocks';
import { validationMessages } from '../../../src/helpers/constants';

describe('Register test suite (localFile provider)', () => {
  it('Register is not supported yet for localFile configProvider', () => {
    expect.assertions(1);

    const envRegistry = new EnvRegistry<string>({
      token: `${process.cwd()}/tests/helpers/envsLocalFile`,
      configProvider: configurationTypes.localFile,
      repository: 'json',
    });

    return envRegistry.register(tag2Data).catch((error) => {
      expect(error).toEqual(new Error(validationMessages.savingIsNotSupported));
    });
  });
});
