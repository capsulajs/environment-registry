import axios from 'axios';
import { toArray } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { environments, devData, masterData, baseUrl, baseRepository, baseApiKey } from '../../helpers/mocks';
import { Env } from '../../helpers/types';

describe('Environments$ test suite (scalecube)', () => {
  it('Subscribe to environments$ method returns all available envKeys and Envs (scalecube configProvider)', (done) => {
    expect.assertions(3);
    // @ts-ignore
    axios.post = jest.fn((url, options) => {
      expect(url).toBe(`${baseUrl}/configuration/readList`);
      expect(options).toEqual({
        apiKey: baseApiKey,
        repository: baseRepository,
      });

      return Promise.resolve({
        data: Object.entries({
          develop: environments.develop,
          master: environments.master,
        }).map((entry) => ({
          key: entry[0],
          value: entry[1],
        })),
      });
    });

    const envRegistry = new EnvRegistry<Env>({
      token: baseApiKey,
      configProvider: configurationTypes.scalecube,
      dispatcherUrl: baseUrl,
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
