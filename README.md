### CapsulaJS: Environment Registry

This service allows to register and load different versions of a
project/service environment.

An environment is an object that contains an `envKey` and an `env`
(which is an array of `accessPoints`).

The service exposes two methods: `register` and `environments$`.

The service requires a token to store the data.

This service will be able to be called by a CI-CD pipeline in order to keep at
disposal each version of projects/services automatically after pushing
modifications.

#### Installation

```bash
yarn add @capsulajs/environment-registry
```

or

```bash
npm i @capsulajs/environment-registry
```

#### Basic usage

```js
import { EnvRegistry } from '@capsulajs/environment-registry';

const envRegistry = new EnvRegistry('my-token');

// Register an environment
envRegistry.register({
  envKey: 'myEnvName',
  env: {
    services: [
      {
        serviceName: 'service1',
        url: 'http://accessPoint/service1',
        methods: {
          myTestMethod1: { asyncModel: 'RequestResponse' },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/service2',
        methods: {
          myTestMethod1: { asyncModel: 'RequestResponse' },
          myTestMethod2: { asyncModel: 'RequestStream' },
          myTestMethod3: { asyncModel: 'RequestStream' },
        },
      },
    ],
  },
});

// Getting environments
envRegistry.environments$({}).subscribe(console.log);
```

Output:

```json
({
  "envKey": "develop",
  "env": {
    "services": [
      {
        "serviceName": "service1",
        "url": "http://accessPoint/service1",
        "methods": {
          "myTestMethod1": { "asyncModel": "RequestResponse" }
        }
      },
      {
        "serviceName": "service1",
        "url": "http://accessPoint/service1",
        "methods": {
          "myTestMethod1": { "asyncModel": "RequestResponse" }
        }
      }
    ]
  }
},
{
  "envKey": "my-tag",
  "env": {
    "env": {
      "services": [
        {
          "serviceName": "service1",
          "url": "http://accessPoint/service1",
          "methods": {
            "myTestMethod1": { "asyncModel": "RequestResponse" }
          }
        },
        {
          "serviceName": "service4",
          "url": "http://accessPoint/service4",
          "methods": {
            "myTestMethod1": { "asyncModel": "RequestResponse" },
            "myTestMethod2": { "asyncModel": "RequestStream" }
          }
        }
      ]
    }
  }
})
```

#### To Do

-   Add logic to select the provider (local storage, file, configuration service, ...)
-   Create an entry point to use in CI
