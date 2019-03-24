import EnvRegistry from '../../src/EnvRegistry';
import { environments } from '../helpers/mocks';
import { validationMessages } from '../../src/utils';
import { AsyncModelType } from '../../src/api/Env';

describe('Register test suite', () => {
  let envRegistry: EnvRegistry;

  beforeEach(() => {
    localStorage.clear();
    envRegistry = new EnvRegistry('token');
  });

  it('Calling register method registers the version of the provided envKey and Env ', async (done) => {
    expect.assertions(1);
    const correctEnvs = [
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
            methods: { myTestMethod1: { asyncModel: 'RequestResponse' as AsyncModelType } },
          },
        ],
      },
      {
        services: [
          {
            serviceName: 'service1',
            url: 'http://test.com',
            methods: {
              myTestMethod1: { asyncModel: 'RequestResponse' as AsyncModelType },
              myTestMethod2: { asyncModel: 'RequestStream' as AsyncModelType },
            },
          },
        ],
      },
    ];

    correctEnvs.forEach(async (env) => {
      await envRegistry.register({ envKey: 'develop', env });
    });

    await envRegistry.register({ envKey: 'develop', env: environments.master });
    envRegistry.environments$({}).subscribe(
      (env) => {
        expect(env).toEqual({ envKey: 'develop', env: environments.master });
      },
      (err) => new Error(err),
      () => done()
    );
  });

  it('Calling register method with invalid request', () => {
    expect.assertions(4);
    const invalidRegisterRequests = [
      {},
      { envKey: 'develop' },
      { env: { services: [] } },
      { envKey: 'develop', env: { services: [] }, extraProp: 42 },
    ];

    invalidRegisterRequests.forEach((request) => {
      envRegistry
        // @ts-ignore
        .register(request)
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.registerRequestIsNotCorrect)));
    });
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

    const badEnvValues = [
      null,
      undefined,
      123,
      'test',
      [],
      ['test'],
      {},
      { test: 'test' },
      { services: [], test: 'test' },
    ];
    badEnvValues.forEach((env) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it('Calling register method with invalid env service', () => {
    expect.assertions(7);
    const invalidService = [
      { url: 'http://test.com', methods: {} },
      { serviceName: 'service1', methods: {} },
      { serviceName: 'service1', url: 'http://test.com' },
      { serviceName: 'service1', url: 'http://test.com', otherKey: {} },
      { serviceName: 'service1', otherKey: 'http://test.com', methods: {} },
      { otherKey: 'service1', url: 'http://test.com', methods: {} },
      { serviceName: 'service1', url: 'http://test.com', methods: {}, extraKey: 42 },
    ];

    invalidService.forEach((service) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env: { services: [service] } })
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
    expect.assertions(6);
    const validService = { serviceName: 'ok', url: 'ok', methods: {} };
    const wrongValues = [null, undefined, 123, 'test', [], ['test']];
    wrongValues.forEach((value) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env: { services: [{ ...validService, methods: value }] } })
        .catch((err: Error) => expect(err).toEqual(new Error(validationMessages.envIsNotCorrect)));
    });
  });

  it("Calling register method with a valid env but env service method entry doesn't comply with the model", () => {
    expect.assertions(15);
    const validService = { serviceName: 'ok', url: 'ok', methods: {} };
    const wrongValues = [
      null,
      undefined,
      123,
      'test',
      [],
      {},
      ['test'],
      { test: 'test' },
      { asyncModel: [] },
      { asyncModel: {} },
      { asyncModel: 42 },
      { asyncModel: 'random' },
      { asyncModel: null },
      { asyncModel: undefined },
      { asyncModel: 'RequestResponse' as AsyncModelType, otherProp: 123 },
    ];
    wrongValues.forEach((value) => {
      envRegistry
        // @ts-ignore
        .register({ envKey: 'master', env: { services: [{ ...validService, methods: { key: value } }] } })
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
