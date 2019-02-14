import EnvRegistry from '../../src/EnvRegistry';
import { environments } from './mocks';
import { validationMessages } from '../../src/utils';

describe('Register test suite', () => {
  let envRegistry: EnvRegistry;

  beforeEach(() => {
    localStorage.clear();
    envRegistry = new EnvRegistry('token');
  });

  it('Calling register method registers the version of the provided envKey and Env ', async (done) => {
    expect.assertions(1);
    await envRegistry.register({ envKey: 'master', env: environments.master});
    envRegistry.environments$({}).subscribe(
      (env) => { expect(env).toEqual({ envKey: 'master', env: environments.master })},
      (err) => console.log(err),
      () => done());
  });

  it('Calling register method with providing not valid envKey and Env', () => {
    expect.assertions(16);

    const badEnvKeyValues = [null, undefined, 123, [], ['test'], {}, { test: 'test' }];
    badEnvKeyValues.forEach((envKey) => {
      // @ts-ignore
      envRegistry.register({ envKey, env: environments.develop })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envKeyIsNotCorrect)));
    });

    const badEnvValues = [null, undefined, 123, 'test', [], ['test'], {}, { test: 'test' }, { accessPoints: [] }];
    badEnvValues.forEach((env) => {
      // @ts-ignore
      envRegistry.register({ envKey: 'master', env })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it('Calling register method with an envKey already registered processes to update', async (done) => {
    expect.assertions(3);
    const devEnv = {
      accessPoints: [{ url: 'http://accessPoint/dev/service1' }, { url: 'http://accessPoint/dev/service2' }]};
    const masterEnv = {
      accessPoints: [{ url: 'http://accessPoint/master/service1' }, { url: 'http://accessPoint/master/service2' }]};
    const createRepoSpy = jest.spyOn(EnvRegistry.prototype, 'createRepository');
    await envRegistry.register({ envKey: 'test', env: environments.develop});
    envRegistry.environments$({}).subscribe((env) => {
      expect(env).toEqual({ envKey: 'test', env: devEnv});
    });
    await envRegistry.register({ envKey: 'test', env: environments.master });
    envRegistry.environments$({}).subscribe((env) => {
      expect(env).toEqual({ envKey: 'test', env: masterEnv});
      expect(createRepoSpy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
