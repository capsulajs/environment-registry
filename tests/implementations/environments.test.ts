import EnvRegistry from '../../src/EnvRegistry';
import { environments } from './mocks';
import { EnvRegistryItem } from '../../src/api/EnvRegistry';

describe('Environments$ test suite', () => {
  let envRegistry: EnvRegistry;

  beforeEach(async () => {
    localStorage.clear();
    envRegistry = new EnvRegistry('token');
    await envRegistry.register({ envKey: 'develop', env: environments.develop});
    await envRegistry.register({ envKey: 'master', env: environments.master});
    await envRegistry.register({ envKey: 'tag-1', env: environments['tag-1']});
  });

  it('Subscribe to environments$ method returns all available envKeys and Envs', async (done) => {
    expect.assertions(4);
    const receivedEnvs: EnvRegistryItem[] = [];
    const expectedArray = [
      { key: 'tag-1', value: environments['tag-1'] },
      { key: 'master', value: environments.master },
      { key: 'develop', value: environments.develop }
    ];
    const expectedUpdatedArray = [
      { key: 'tag-1', value: environments['tag-1'] },
      { key: 'master', value: environments.master },
      { key: 'tag-2', value: environments['tag-2'] },
      { key: 'develop', value: environments.develop }
    ];
    await new Promise((resolve => {
      envRegistry.environments$({})
        .subscribe(
          (data) => receivedEnvs.push(data),
          (err) => console.log(err),
          () => {
            expect(receivedEnvs).toHaveLength(3);
            expect(receivedEnvs).toEqual(expect.arrayContaining(expectedArray));
            resolve();
          });
    }));
    await envRegistry.register({ envKey: 'tag-2', env: environments['tag-2']});
    receivedEnvs.length = 0;
    envRegistry.environments$({})
      .subscribe(
        (data) => receivedEnvs.push(data),
        (err) => console.log(err),
        () => {
          expect(receivedEnvs).toHaveLength(4);
          expect(receivedEnvs).toEqual(expect.arrayContaining(expectedUpdatedArray));
          done()
        });
  });
});
