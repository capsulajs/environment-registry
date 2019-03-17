export const environments: any = {
  develop: {
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
  },
  master: {
    services: [
      {
        serviceName: 'service1',
        url: 'http://accessPoint/master/service1',
        methods: {
          myTestMethod1: { asyncModel: 'Promise' },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/master/service2',
        methods: {
          myTestMethod1: { asyncModel: 'Promise' },
          myTestMethod2: { asyncModel: 'Observable' },
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
          myTestMethod1: { asyncModel: 'Promise' },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/tag-1/service2',
        methods: {
          myTestMethod1: { asyncModel: 'Promise' },
          myTestMethod2: { asyncModel: 'Observable' },
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
          myTestMethod1: { asyncModel: 'Promise' },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/tag-2/service2',
        methods: {
          myTestMethod1: { asyncModel: 'Promise' },
          myTestMethod2: { asyncModel: 'Observable' },
          myTestMethod42: { asyncModel: 'Promise' },
        },
      },
    ],
  },
};
