import { EnvRegistry } from '../../src';
import { environments } from '../helpers/mocks';
import { EnvRegistryItem } from '../../src/api/EnvRegistry';

describe('Environments$ test suite', () => {
  let envRegistry: EnvRegistry<any>;

  beforeEach(async () => {
    localStorage.clear();
    envRegistry = new EnvRegistry('token');
    await envRegistry.register({ envKey: 'develop', env: environments.develop });
    await envRegistry.register({ envKey: 'master', env: environments.master });
    await envRegistry.register({ envKey: 'tag-1', env: environments['tag-1'] });
  });

  it('Subscribe to environments$ method returns all available envKeys and Envs', async (done) => {
    expect.assertions(4);
    const receivedEnvs: Array<EnvRegistryItem<any>> = [];
    const expectedArray = [
      { envKey: 'tag-1', env: environments['tag-1'] },
      { envKey: 'master', env: environments.master },
      { envKey: 'develop', env: environments.develop },
    ];
    const expectedUpdatedArray = [
      { envKey: 'tag-1', env: environments['tag-1'] },
      { envKey: 'master', env: environments.master },
      { envKey: 'tag-2', env: environments['tag-2'] },
      { envKey: 'develop', env: environments.develop },
    ];
    await new Promise((resolve) => {
      envRegistry.environments$({}).subscribe(
        (data) => receivedEnvs.push(data),
        (err) => new Error(err),
        () => {
          expect(receivedEnvs).toHaveLength(3);
          expect(receivedEnvs).toEqual(expect.arrayContaining(expectedArray));
          resolve();
        }
      );
    });
    await envRegistry.register({ envKey: 'tag-2', env: environments['tag-2'] });
    receivedEnvs.length = 0;
    envRegistry.environments$({}).subscribe(
      (data) => receivedEnvs.push(data),
      (err) => new Error(err),
      () => {
        expect(receivedEnvs).toHaveLength(4);
        expect(receivedEnvs).toEqual(expect.arrayContaining(expectedUpdatedArray));
        done();
      }
    );
  });
});
