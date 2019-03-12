### CapsulaJS: Environment Registry

This service allows to register and load different versions of a
project/service environment.

An environment is an object that contains an `envKey` and an `env`
(which is an array of `accessPoints`)

_Install it_ (coming soon)

```bash
yarn add @capsulajs/environment-registry
npm i @capsulajs/environment-registry
```

The service exposes two methods: `register` and `environments$`.
The service requires a token to store the data.

_Examples :_

```js
import { EnvRegistry } from '@capsulajs/environment-registry';

const envRegistry = new EnvRegistry('my-token');

envRegistry.register({
  envKey: 'myEnvName',
  env:
    accessPoints: [
      { url: 'http://accessPoint/myEnvName/service1' },
      { url: 'http://accessPoint/myEnvName/service2' },
      { url: 'http://accessPoint/myEnvName/serviceN' }
    ]
});

envRegistry.environments$({}).subscribe(console.log);
// Output
{
  envKey: 'develop',
  env: accessPoints [
    { url: 'http://url-to-my-service/develop/service-1'},
    { url: 'http://url-to-my-service/develop/service-2'},
    { url: 'http://url-to-my-service/develop/service-3'},
    { url: 'http://url-to-my-service/develop/service-4'},
  ]
},
{
  envKey: 'my-tag',
  env: accessPoints [
    { url: 'http://url-to-my-service/my-tag/service-1'},
    { url: 'http://url-to-my-service/my-tag/service-4'},
  ]
}
```

This service will be able to be called by a CI-CD pipeline in order to keep at
disposal each version of projects/services automatically after pushing
modifications.

#### To Do

<!-- prettier-ignore -->
  - Add logic to select the provider (local storage, file, configuration service, ...)
  - Create an entry point to use in CI
