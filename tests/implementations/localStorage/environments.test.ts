import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { devData, masterData, tag1Data, tag2Data } from '../../helpers/mocks';
import { Env } from '../../helpers/types';
import { EnvRegistryItem } from '../../../src/api';

describe('Environments$ test suite (localStorage)', () => {
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
});
