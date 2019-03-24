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

  it.each(correctEnvs)(
    'Calling register method registers the version of the provided envKey and Env: %j',
    async (request, done) => {
      expect.assertions(1);

      await envRegistry.register({ envKey: 'develop', env: request });

      return envRegistry.environments$({}).subscribe(
        (env) => {
          expect(env).toEqual({ envKey: 'develop', env: request });
        },
        (err) => new Error(err),
        () => done()
      );
    }
  );

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

  const invalidEnvValues = [
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

  it.each(invalidEnvValues)('Calling register method with providing not valid env: %j', (env) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(envRegistry.register({ envKey: 'develop', env })).rejects.toEqual(
      new Error(validationMessages.envIsNotCorrect)
    );
  });

  const invalidServices = [
    { url: 'http://test.com', methods: {} },
    { serviceName: 'service1', methods: {} },
    { serviceName: 'service1', url: 'http://test.com' },
    { serviceName: 'service1', url: 'http://test.com', otherKey: {} },
    { serviceName: 'service1', otherKey: 'http://test.com', methods: {} },
    { otherKey: 'service1', url: 'http://test.com', methods: {} },
    { serviceName: 'service1', url: 'http://test.com', methods: {}, extraKey: 42 },
  ];

  it.each(invalidServices)('Calling register method with invalid env service: %j', (service) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(envRegistry.register({ envKey: 'master', env: { services: [service] } })).rejects.toEqual(
      new Error(validationMessages.envIsNotCorrect)
    );
  });

  const invalidServiceNames = [null, undefined, 123, [], ['test'], {}, { test: 'test' }];

  it.each(invalidServiceNames)(
    'Calling register method with a valid env but invalid env service serviceName: %j',
    (serviceName) => {
      expect.assertions(1);
      const validService = { serviceName, url: 'ok', methods: {} };
      // @ts-ignore
      return expect(envRegistry.register({ envKey: 'master', env: { services: [validService] } })).rejects.toEqual(
        new Error(validationMessages.envIsNotCorrect)
      );
    }
  );

  const invalidServiceUrls = [null, undefined, 123, [], ['test'], {}, { test: 'test' }];

  it.each(invalidServiceUrls)('Calling register method with a valid env but invalid env service url: %j', (url) => {
    expect.assertions(1);
    const validService = { serviceName: 'ok', url, methods: {} };
    // @ts-ignore
    return expect(envRegistry.register({ envKey: 'master', env: { services: [validService] } })).rejects.toEqual(
      new Error(validationMessages.envIsNotCorrect)
    );
  });

  const invalidServiceMethods = [null, undefined, 123, 'test', [], ['test']];

  it.each(invalidServiceMethods)(
    'Calling register method with a valid env but invalid env service methods: %j',
    (methods) => {
      expect.assertions(1);
      const validService = { serviceName: 'ok', url: 'ok', methods };
      // @ts-ignore
      return expect(envRegistry.register({ envKey: 'master', env: { services: [validService] } })).rejects.toEqual(
        new Error(validationMessages.envIsNotCorrect)
      );
    }
  );

  const invalidServiceMethod = [
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

  it.each(invalidServiceMethod)(
    "Calling register method with a valid env but env service method entry doesn't comply with the model: %j",
    (method) => {
      expect.assertions(1);
      const validService = { serviceName: 'ok', url: 'ok', methods: { key: method } };
      // @ts-ignore
      return expect(envRegistry.register({ envKey: 'master', env: { services: [validService] } })).rejects.toEqual(
        new Error(validationMessages.envIsNotCorrect)
      );
    }
  );

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
