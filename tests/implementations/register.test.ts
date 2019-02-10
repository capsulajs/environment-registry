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
    envRegistry.environments$({}).subscribe((env) => {
      expect(env).toEqual({key: 'master', value: environments.master });
      done();
    });
  });

  it('Calling register method without providing the envKey and Env (empty envKey or Env) ', async () => {
    expect.assertions(16);

    const badEnvKeyValues = [null, undefined, 123, [], ['test'], {}, { test: 'test' }];
    badEnvKeyValues.forEach((envKey) => {
      // @ts-ignore
      envRegistry.register({ envKey, env: environments.develop })
        .catch((err: any) => expect(err).toEqual(new Error(validationMessages.envKeyIsNotCorrect)));
    });

    const badEnvValues = [null, undefined, 123, 'test', [], ['test'], {}, { test: 'test' }, { accessPoints: [] }];
    badEnvValues.forEach((env) => {
      // @ts-ignore
      envRegistry.register({ envKey: 'master', env })
        .catch((err: any) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it('Calling register method with an envKey already registered ', async (done) => {
    expect.assertions(1);
    await envRegistry.register({ envKey: 'test', env: environments.develop});
    await envRegistry.register({ envKey: 'test', env: environments.master });
    envRegistry.environments$({}).subscribe((env) => {
      expect(env).toEqual({ key: 'test', value: { accessPoints: [
            { url: 'http://accessPoint/master/service1' },
            { url: 'http://accessPoint/master/service2' }
          ]}});
      done();
    });
  });

  // it('Server error occurs after calling register method ', () => {});
});
