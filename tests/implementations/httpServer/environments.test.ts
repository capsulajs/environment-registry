import axios from 'axios';
import { toArray } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { environments, devData, masterData, baseUrl, baseRepository } from '../../helpers/mocks';
import { Env } from '../../helpers/types';

describe('Environments$ test suite (httpServer)', () => {
  it('Subscribe to environments$ method returns all available envKeys and Envs (httpServer configProvider)', (done) => {
    expect.assertions(2);

    // @ts-ignore
    axios.post = jest.fn((url) => {
      expect(url).toBe(`${baseUrl}/${baseRepository}`);
      return Promise.resolve({
        data: {
          develop: environments.develop,
          master: environments.master,
        },
      });
    });

    const envRegistry = new EnvRegistry<Env>({
      token: baseUrl,
      configProvider: configurationTypes.httpServer,
      repository: baseRepository,
    });
    envRegistry
      .environments$({})
      .pipe(toArray())
      .subscribe((envs) => {
        expect(envs).toEqual([devData, masterData]);
        // @ts-ignore
        axios.post.mockClear();
        done();
      });
  });
});
