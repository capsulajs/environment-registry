import { toArray } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';

describe('Environments$ test suite (localFile)', () => {
  it('Subscribe to environments$ method returns all available envKeys and Envs (localFile configProvider)', (done) => {
    expect.assertions(1);
    const localFileToken = `${process.cwd()}/tests/helpers/envsLocalFile`;
    const localFileRepository = 'json';

    const envRegistryLocalFile = new EnvRegistry<string>({
      token: localFileToken,
      configProvider: configurationTypes.localFile,
      repository: localFileRepository,
    });

    envRegistryLocalFile
      .environments$({})
      .pipe(toArray())
      .subscribe((envs) => {
        expect(envs).toEqual([{ env: 'test', envKey: 'develop' }, { env: 'test5', envKey: 'master' }]);
        done();
      });
  });
});
