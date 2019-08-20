import { toArray } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../src';
import { environments } from '../helpers/mocks';
import { Env } from '../helpers/types';
import { EnvRegistryItem } from '../../src/api/EnvRegistry';

describe('Environments$ test suite', () => {
  let envRegistry: EnvRegistry<Env>;

  const devData = { envKey: 'develop', env: environments.develop };
  const masterData = { envKey: 'master', env: environments.master };
  const tag1Data = { envKey: 'tag-1', env: environments['tag-1'] };
  const tag2Data = { envKey: 'tag-2', env: environments['tag-2'] };

  beforeEach(async () => {
    localStorage.clear();
    envRegistry = new EnvRegistry({ token: 'token', configProvider: configurationTypes.localStorage });
    await envRegistry.register(devData);
    await envRegistry.register(masterData);
    await envRegistry.register(tag1Data);
  });

  it('Subscribe to environments$ method returns all available envKeys and Envs (LocalStorage configProvider)', async (done) => {
    expect.assertions(4);
    const receivedEnvs: Array<EnvRegistryItem<Env>> = [];
    const expectedArray = [tag1Data, masterData, devData];
    const expectedUpdatedArray = [tag1Data, masterData, tag2Data, devData];
    await new Promise((resolve) => {
      envRegistry.environments$({}).subscribe(
        (data) => receivedEnvs.push(data),
        (err) => err,
        () => {
          expect(receivedEnvs).toHaveLength(3);
          expect(receivedEnvs).toEqual(expect.arrayContaining(expectedArray));
          resolve();
        }
      );
    });
    await envRegistry.register(tag2Data);
    receivedEnvs.length = 0;
    envRegistry.environments$({}).subscribe(
      (data) => receivedEnvs.push(data),
      (err) => err,
      () => {
        expect(receivedEnvs).toHaveLength(4);
        expect(receivedEnvs).toEqual(expect.arrayContaining(expectedUpdatedArray));
        done();
      }
    );
  });

  it('Subscribe to environments$ method returns all available envKeys and Envs (httpFile configProvider)', (done) => {
    expect.assertions(2);

    // @ts-ignore
    global.fetch = jest.fn((fetchUrl) => {
      expect(fetchUrl).toBe('http://localhost:3000/env-repo.json');
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            develop: environments.develop,
            master: environments.master,
          }),
      });
    });

    const envRegistryHttpFile = new EnvRegistry<Env>({
      token: 'http://localhost:3000',
      configProvider: 'httpFile',
      repository: 'env-repo',
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
