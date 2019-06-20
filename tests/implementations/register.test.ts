import { EnvRegistry } from '../../src';
import { environments } from '../helpers/mocks';
import { validationMessages } from '../../src/helpers/constants';

describe('Register test suite', () => {
  let envRegistry: EnvRegistry<any>;

  beforeEach(() => {
    localStorage.clear();
    envRegistry = new EnvRegistry('token');
  });

  const correctEnvs = [
    null,
    123,
    'test',
    [],
    ['test'],
    {},
    { test: 'test' },
    { services: [] },
    { services: [{ serviceName: 'service1', url: 'http://test.com', methods: {} }] },
    {
      services: [
        { serviceName: 'service1', url: 'http://test.com', methods: {} },
        { serviceName: 'service2', url: 'http://test.com', methods: {} },
      ],
    },
    {
      services: [
        {
          serviceName: 'service1',
          url: 'http://test.com',
          methods: { myTestMethod1: { asyncModel: 'RequestResponse' } },
        },
      ],
    },
    {
      services: [
        {
          serviceName: 'service1',
          url: 'http://test.com',
          methods: {
            myTestMethod1: { asyncModel: 'RequestResponse' },
            myTestMethod2: { asyncModel: 'RequestStream' },
          },
        },
      ],
    },
  ];

  it.each(correctEnvs)(
    'Calling register method registers the version of the provided envKey and Env: %j',
    async (request, done) => {
      expect.assertions(1);

      await envRegistry.register({ envKey: 'develop', env: request });

      return envRegistry.environments$({}).subscribe(
        (env: any) => {
          expect(env).toEqual({ envKey: 'develop', env: request });
        },
        (err: Error) => err,
        () => done()
      );
    }
  );

  it('Calling register method with undefined env delete the environment of the provided envKey', async (done) => {
    expect.assertions(1);

    await envRegistry.register({ envKey: 'master', env: 'master test' });
    await envRegistry.register({ envKey: 'develop', env: 'develop test' });
    await envRegistry.register({ envKey: 'develop', env: undefined });

    return envRegistry
      .environments$({})
      .subscribe(
        (env) => expect(env).toEqual({ envKey: 'master', env: 'master test' }),
        (err: Error) => err,
        () => done()
      );
  });

  const invalidRegisterRequests = [
    {},
    { envKey: 'develop' },
    { env: { services: [] } },
    { envKey: 'develop', env: { services: [] }, extraProp: 42 },
  ];

  it.each(invalidRegisterRequests)('Calling register method with invalid request: %j', (request) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(envRegistry.register(request)).rejects.toEqual(
      new Error(validationMessages.registerRequestIsNotCorrect)
    );
  });

  const invalidEnvKeyValues = [null, undefined, 123, [], ['test'], {}, { test: 'test' }];

  it.each(invalidEnvKeyValues)('Calling register method with providing not valid envKey: %j', (envKey) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(envRegistry.register({ envKey, env: environments.develop })).rejects.toEqual(
      new Error(validationMessages.envKeyIsNotCorrect)
    );
  });

  it('Calling register method with an envKey already registered', async (done) => {
    expect.assertions(3);
    const devEnv = {
      services: [
        {
          serviceName: 'service1',
          url: 'http://accessPoint/dev/service1',
          methods: {
            myTestMethod1: { asyncModel: 'RequestResponse' },
          },
        },
        {
          serviceName: 'service2',
          url: 'http://accessPoint/dev/service2',
          methods: {
            myTestMethod1: { asyncModel: 'RequestResponse' },
            myTestMethod2: { asyncModel: 'RequestStream' },
            myTestMethod3: { asyncModel: 'RequestStream' },
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
    envRegistry.environments$({}).subscribe((env: any) => {
      expect(env).toEqual({ envKey: 'test', env: devEnv });
    });
    await envRegistry.register({ envKey: 'test', env: environments.master });
    envRegistry.environments$({}).subscribe((env: any) => {
      expect(env).toEqual({ envKey: 'test', env: masterEnv });
      expect(createRepoSpy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
