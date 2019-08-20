import { toArray } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { environments, devData, masterData, baseUrl, baseRepository } from '../../helpers/mocks';
import { Env } from '../../helpers/types';

describe('Environments$ test suite (httpFile)', () => {
  it('Subscribe to environments$ method returns all available envKeys and Envs (httpFile configProvider)', (done) => {
    expect.assertions(2);
    // @ts-ignore
    global.fetch = jest.fn((fetchUrl) => {
      expect(fetchUrl).toBe(`${baseUrl}/${baseRepository}.json`);
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            develop: environments.develop,
            master: environments.master,
          }),
      });
    });

    const envRegistry = new EnvRegistry<Env>({
      token: baseUrl,
      configProvider: configurationTypes.httpFile,
      repository: baseRepository,
    });
    envRegistry
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
