import EnvRegistry from '../../src/EnvRegistry';
import { environments } from './mocks';

describe('Register test suite', () => {
  const envRegistry = new EnvRegistry('token');

  beforeEach(() => localStorage.clear());

  it('Calling register method registers the version of the provided envKey and Env ', () => {
    expect.assertions(1);
    envRegistry.environments$({}).subscribe((env) => {
      console.log(env);
      expect(env).toEqual({});
    });
    envRegistry.register({ envKey: 'dev', env: { accessPoints: [{ url: 'http://aaa.com' }]}})
      .then(() => console.log('SUCCESS'))
      .catch(err => console.log(err));
  });

  it('Calling register method without providing the envKey and Env (empty envKey or Env) ', () => {
    expect.assertions(2);
    // @ts-ignore
    envRegistry.register({ envKey: null, env: environments.develop })
      .catch((err: any) => expect(err).toBe(new Error('no envKey provided')));
    // @ts-ignore
    envRegistry.register({ envKey: 'master', env: {} })
      .catch((err: any) => expect(err).toBe(new Error('wrong env provided')));
  });

  it('Calling register method with an envKey already registered ', () => {
    expect.assertions(1);
    envRegistry.register({ envKey: 'dev', env: environments.develop})
      .then(() => console.log('SUCCESS'))
      .catch(err => console.log(err));
    envRegistry.environments$({}).subscribe((env) => {
      console.log(env);
      expect(env).toEqual({});
    });
    envRegistry.register({ envKey: 'dev', env: environments.master })
      .then(() => console.log('SUCCESS'))
      .catch(err => console.log(err));
  });

  // it('Server error occurs after calling register method ', () => {});
});
