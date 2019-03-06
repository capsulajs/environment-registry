### CapsulaJS: Environment Registry

This service allows to register and load different versions of a
project/service environment.

An environment is an object that contains an `envKey` and an `env`
(which is an array of `accessPoints`)

_Examples :_

```js
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
