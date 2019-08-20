import axios from 'axios';
import { toArray } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { environments, devData, masterData } from '../../helpers/mocks';
import { Env } from '../../helpers/types';

describe('Environments$ test suite (httpServer)', () => {
  it('Subscribe to environments$ method returns all available envKeys and Envs (httpServer configProvider)', (done) => {
    expect.assertions(2);

    const httpServerToken = 'http://localhost:3000';
    const httpServerRepository = 'env-repo';

    // @ts-ignore
    axios.post = jest.fn((url) => {
      expect(url).toBe(`${httpServerToken}/${httpServerRepository}`);
      return Promise.resolve({
        data: {
          develop: environments.develop,
          master: environments.master,
        },
      });
    });

    const envRegistryScalecube = new EnvRegistry<Env>({
      token: httpServerToken,
      configProvider: configurationTypes.httpServer,
      repository: httpServerRepository,
    });
    envRegistryScalecube
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
