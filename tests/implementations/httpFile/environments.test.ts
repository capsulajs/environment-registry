import { toArray } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { environments, devData, masterData } from '../../helpers/mocks';
import { Env } from '../../helpers/types';

describe('Environments$ test suite (httpFile)', () => {
  it('Subscribe to environments$ method returns all available envKeys and Envs (httpFile configProvider)', (done) => {
    expect.assertions(2);
    const httpFileToken = 'http://localhost:3000';
    const repository = 'env-repo';

    // @ts-ignore
    global.fetch = jest.fn((fetchUrl) => {
      expect(fetchUrl).toBe(`${httpFileToken}/${repository}.json`);
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            develop: environments.develop,
            master: environments.master,
          }),
      });
    });

    const envRegistryHttpFile = new EnvRegistry<Env>({
      token: httpFileToken,
      configProvider: configurationTypes.httpFile,
      repository: repository,
    });
    envRegistryHttpFile
      .environments$({})
      .pipe(toArray())
      .subscribe((envs) => {
        expect(envs).toEqual([devData, masterData]);
        // @ts-ignore
        global.fetch.mockClear();
        done();
      });
  });
});
