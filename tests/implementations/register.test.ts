import EnvRegistry from '../../src/EnvRegistry';
import { environments } from './mocks';

describe('Register test suite', () => {
  let envRegistry: EnvRegistry;

  const checkExpectedEntries = async (expected: any) => {
    const entries = await envRegistry.configurationService.entries({ repository: 'environmentRegistry'});
    await expect(entries).toEqual(expected);
  };

  beforeEach(() => {
    localStorage.clear();
    envRegistry = new EnvRegistry('token');
  });

  it('Calling register method registers the version of the provided envKey and Env ', async (done) => {
    expect.assertions(1);

    envRegistry.register({ envKey: 'master', env: environments.master})
      .then(async () => {
        await checkExpectedEntries({ entries: [{ key: 'master', value: { accessPoints: [
                { url: 'http://accessPoint/master/service1' },
                { url: 'http://accessPoint/master/service2' }
              ]}}]});
        done();
        // envRegistry.environments$({}).subscribe((env) => {
        //   console.log(env);
        //   expect(env).toEqual([]);
        // });
      })
      .catch(err => console.log(err));
  });

  // it('Calling register method without providing the envKey and Env (empty envKey or Env) ', async () => {
  //   expect.assertions(2);
  //   // @ts-ignore
  //   envRegistry.register({ envKey: null, env: environments.develop })
  //     .catch((err: any) => expect(err).toBe(new Error('no envKey provided')));
  //   // @ts-ignore
  //   envRegistry.register({ envKey: 'master', env: {} })
  //     .catch((err: any) => expect(err).toBe(new Error('wrong env provided')));
  // });

  it('Calling register method with an envKey already registered ', async (done) => {
    expect.assertions(1);
    await envRegistry.register({ envKey: 'test', env: environments.develop});
    // envRegistry.environments$({}).subscribe((env) => {
    //   console.log(env);
    //   expect(env).toEqual({});
    // });
    envRegistry.register({ envKey: 'test', env: environments.master })
      .then(async () => {
        await checkExpectedEntries({ entries: [{ key: 'test', value: { accessPoints: [
                { url: 'http://accessPoint/master/service1' },
                { url: 'http://accessPoint/master/service2' }
              ]}}]});
        done();
      });
  });

  // it('Server error occurs after calling register method ', () => {});
});
