export const environments: any = {
  develop: {
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
  },
  master: {
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
  },
  'tag-1': {
    services: [
      {
        serviceName: 'service1',
        url: 'http://accessPoint/tag-1/service1',
        methods: {
          myTestMethod1: { asyncModel: 'RequestResponse' },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/tag-1/service2',
        methods: {
          myTestMethod1: { asyncModel: 'RequestResponse' },
          myTestMethod2: { asyncModel: 'RequestStream' },
        },
      },
    ],
  },
  'tag-2': {
    services: [
      {
        serviceName: 'service1',
        url: 'http://accessPoint/tag-2/service1',
        methods: {
          myTestMethod1: { asyncModel: 'RequestResponse' },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/tag-2/service2',
        methods: {
          myTestMethod1: { asyncModel: 'RequestResponse' },
          myTestMethod2: { asyncModel: 'RequestStream' },
          myTestMethod42: { asyncModel: 'RequestResponse' },
        },
      },
    ],
  },
};

export const devData = { envKey: 'develop', env: environments.develop };
export const masterData = { envKey: 'master', env: environments.master };
export const tag1Data = { envKey: 'tag-1', env: environments['tag-1'] };
export const tag2Data = { envKey: 'tag-2', env: environments['tag-2'] };

export const baseUrl = 'http://localhost:3000';
export const baseRepository = 'env-repo';
export const baseApiKey = 'tokenabc';
