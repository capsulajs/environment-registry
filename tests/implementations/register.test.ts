import EnvRegistry from '../../src/EnvRegistry';
import { environments } from '../helpers/mocks';
import { validationMessages } from '../../src/utils';

describe('Register test suite', () => {
  let envRegistry: EnvRegistry;

  beforeEach(() => {
    localStorage.clear();
    envRegistry = new EnvRegistry('token');
  });

  it('Calling register method registers the version of the provided envKey and Env ', async (done) => {
    expect.assertions(1);
    await envRegistry.register({ envKey: 'master', env: environments.master });
    envRegistry.environments$({}).subscribe(
      (env) => {
        expect(env).toEqual({ envKey: 'master', env: environments.master });
      },
      (err) => new Error(err),
      () => done()
    );
  });

  it('Calling register method with providing not valid envKey and Env', () => {
    expect.assertions(16);

    const badEnvKeyValues = [null, undefined, 123, [], ['test'], {}, { test: 'test' }];
    badEnvKeyValues.forEach((envKey) => {
      envRegistry
        // @ts-ignore
        .register({ envKey, env: environments.develop })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envKeyIsNotCorrect)));
    });

    const badEnvValues = [null, undefined, 123, 'test', [], ['test'], {}, { test: 'test' }, { services: [] }];
    badEnvValues.forEach((env) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it('Calling register method with a valid env but invalid env service serviceName', () => {
    expect.assertions(7);
    const validService = { serviceName: 'ok', url: 'ok', methods: {} };
    const wrongValues = [null, undefined, 123, [], ['test'], {}, { test: 'test' }];
    wrongValues.forEach((value) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env: { services: [{ ...validService, serviceName: value }] } })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it('Calling register method with a valid env but invalid env service url', () => {
    expect.assertions(7);
    const validService = { serviceName: 'ok', url: 'ok', methods: {} };
    const wrongValues = [null, undefined, 123, [], ['test'], {}, { test: 'test' }];
    wrongValues.forEach((value) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env: { services: [{ ...validService, url: value }] } })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it('Calling register method with a valid env but invalid env service methods', () => {
    expect.assertions(7);
    const validService = { serviceName: 'ok', url: 'ok', methods: {} };
    const wrongValues = [null, undefined, 123, 'test', [], ['test'], { test: 'test' }];
    wrongValues.forEach((value) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env: { services: [{ ...validService, methods: value }] } })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it("Calling register method with a valid env but env service method entry doesn't comply with the model", () => {
    expect.assertions(6);
    const validService = { serviceName: 'ok', url: 'ok', methods: {} };
    const wrongValues = [
      { asyncModel: [] },
      { asyncModel: {} },
      { asyncModel: 42 },
      { asyncModel: 'random' },
      { asyncModel: null },
      { asyncModel: undefined },
    ];
    wrongValues.forEach((value) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env: { services: [{ ...validService, url: value }] } })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it('Calling register method with an envKey already registered processes to update', async (done) => {
    expect.assertions(3);
    const devEnv = {
      services: [
        {
          serviceName: 'service1',
          url: 'http://accessPoint/dev/service1',
          methods: {
            myTestMethod1: { asyncModel: 'Promise' },
          },
        },
        {
          serviceName: 'service2',
          url: 'http://accessPoint/dev/service2',
          methods: {
            myTestMethod1: { asyncModel: 'Promise' },
            myTestMethod2: { asyncModel: 'Observable' },
            myTestMethod3: { asyncModel: 'Observable' },
          },
        },
      ],
    };
    const masterEnv = {
      services: [
        {
          serviceName: 'service1',
          url: 'http://accessPoint/master/service1',
          methods: {
            myTestMethod1: { asyncModel: 'RequestResponse' },
          },
        },
        {
          serviceName: 'service2',
          url: 'http://accessPoint/master/service2',
          methods: {
            myTestMethod1: { asyncModel: 'RequestResponse' },
            myTestMethod2: { asyncModel: 'RequestStream' },
          },
        },
      ],
    };
    // @ts-ignore
    const createRepoSpy = jest.spyOn(envRegistry, 'createRepository');
    await envRegistry.register({ envKey: 'test', env: environments.develop });
    envRegistry.environments$({}).subscribe((env) => {
      expect(env).toEqual({ envKey: 'test', env: devEnv });
    });
    await envRegistry.register({ envKey: 'test', env: environments.master });
    envRegistry.environments$({}).subscribe((env) => {
      expect(env).toEqual({ envKey: 'test', env: masterEnv });
      expect(createRepoSpy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
