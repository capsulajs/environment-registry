import axios from 'axios';
import { toArray } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { environments } from '../../helpers/mocks';
import { Env } from '../../helpers/types';
import { EnvRegistryItem } from '../../../src/api';

describe('Environments$ test suite (localStorage)', () => {
  const devData = { envKey: 'develop', env: environments.develop };
  const masterData = { envKey: 'master', env: environments.master };
  const tag1Data = { envKey: 'tag-1', env: environments['tag-1'] };
  const tag2Data = { envKey: 'tag-2', env: environments['tag-2'] };

  it('Subscribe to environments$ method returns all available envKeys and Envs (LocalStorage configProvider)', async (done) => {
    expect.assertions(4);
    localStorage.clear();
    const envRegistry = new EnvRegistry<Env>({ token: 'token', configProvider: configurationTypes.localStorage });
    await envRegistry.register(devData);
    await envRegistry.register(masterData);
    await envRegistry.register(tag1Data);
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

  it('Subscribe to environments$ method returns all available envKeys and Envs (scalecube configProvider)', (done) => {
    expect.assertions(3);

    const scToken = 'tokenabc';
    const scRepository = 'env-repo';
    const scUrl = 'http://localhost:3000';

    // @ts-ignore
    axios.post = jest.fn((url, options) => {
      expect(url).toBe(`${scUrl}/configuration/readList`);
      expect(options).toEqual({
        apiKey: scToken,
        repository: scRepository,
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

    const envRegistryScalecube = new EnvRegistry<Env>({
      token: scToken,
      configProvider: configurationTypes.scalecube,
      dispatcherUrl: scUrl,
      repository: scRepository,
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
