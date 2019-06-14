Feature: Support multiple configuration providers in Env. Registry

Scenario: Create EnvRegistry with available configProvider and valid token
  Given a configuration
  And token "tokenA" that allows access to this configuration using <configProvider> and <dispatcherUrl>
    |<configProvider>                   | <dispatcherUrl> |
    |LocalFileConfigurationProvider     | (empty)         |
    |HttpFileConfigurationProvider      | (empty)         |
    |ScalecubeConfigurationProvider     | 'dispatcherUrl1'|
    |HttpServerConfigurationProvider    | (empty)         |
    |LocalStorageConfigurationProvider  | (empty)         |
  When create new EnvRegistry with tokenA, <configProvider> and <dispatcherUrl>
  Then EnvRegistry is created with the provided configuration provider

Scenario: Create EnvRegistry without configProvider - default configProvider is used
  Given a configuration with tokenA that allows access to this configuration
  And  "HttpFileConfigurationProvider" is the default configProvider
  When create new EnvRegistry with tokenA
  Then EnvRegistry is created with "HttpFileConfigurationProvider"

Scenario: Create EnvRegistry with non-existent configProvider throws an error
  Given a configuration with "tokenA" that allows access to this configuration
  And "configProviderA" is not an available configuration type
  When create new EnvRegistry with token "tokenA" and configProvider"configProviderA"
  Then an error is thrown

Scenario: Create EnvRegistry with invalid value of configProvider
  Given a configuration with "tokenA" that allows access to this configuration
  When create new EnvRegistry with token "tokenA" and the <configProvider>
    |<configProvider> |
    |''        |
    |{}        |
    |{ test: 'test' }|
    |[]        |
    |['test']  |
    |null      |
    |true      |
    |false     |
    |0         |
    |-1        |
  Then an error is thrown

Scenario: Create EnvRegistry with non-existent token
  Given a configuration with "tokenA" that allows access to this configuration using "LocalFileConfigurationProvider"
  When create new EnvRegistry with token "tokenB" and "LocalFileConfigurationProvider" configProvider
  Then an error is thrown

Scenario: Create EnvRegistry with a token with invalid format
  Given a valid token is a non empty string
  When create new EnvRegistry with a valid configProvider and the following <token>
    |<token>   |
    |' '       |
    |{}        |
    |{ test: 'test' }|
    |[]        |
    |['test']  |
    |null      |
    |undefined |
    |true      |
    |false     |
    |0         |
    |-1        |
  Then an error is thrown
