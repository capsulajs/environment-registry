### CapsulaJS: Environment Registry

This service allows to register and load different versions of a
project/service environment.

An environment is an object that contains an `envKey` and an `env`.

The service exposes two methods: `register` and `environments$`.

EnvironmentRegistry can be created with all the possible providers from ConfigurationService (https://github.com/capsulajs/configuration-service).

```typescript
interface EnvRegistryOptions {
  /** Token used to get environments data */
  token: string;
  /**
   * The type of configuration provider, that will be used to get environments data
   * Possible values: "localFile","httpFile","scalecube","httpServer","localStorage"
   * @default "httpFile"
   */
  configProvider?: CONFIGURATION_SERVICE_API.ConfigurationProvider;
  /**
   * Dispatcher url, that will be used in "scalecube" config provider
   */
  dispatcherUrl?: string;
  /**
   * The name of the repository, that is used to get entries from ConfigurationService
   * @default environmentRegistry
   */
  repository?: string;
}
```

- Getting the already registered environments (**environments$** method) is possible in every configurationProvider;
- Registering new environments (**register** method) is possible with the following configurationProviders: "localStorage", "scalecube".

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

const envRegistry = new EnvRegistry({ token: 'http://envs-data-link.com' });

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
{
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
}
```

```json
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
}
```

#### To Do

-   Create an entry point to use in CI
