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
  And  repository "test"
  When create new EnvRegistry with tokenA, repository, <configProvider> and <dispatcherUrl>
  Then EnvRegistry is created with the provided configuration provider

Scenario: Create EnvRegistry without configProvider - default configProvider is used
  Given a configuration with tokenA that allows access to this configuration
  And  "HttpFileConfigurationProvider" is the default configProvider
  When create new EnvRegistry with tokenA
  Then EnvRegistry is created with "HttpFileConfigurationProvider"

Scenario: Create EnvRegistry with non-existent configProvider throws an error
  Given a configuration with "tokenA" that allows access to this configuration
  And "configProviderA" is not an `ConfigurationProvider` type
  When create new EnvRegistry with token "tokenA" and configProvider"configProviderA"
  Then a `nonExistentConfigurationProviderError` is thrown

Scenario: Create EnvRegistry with invalid value of configProvider
  Given a configuration with "tokenA" that allows access to this configuration
  When create new EnvRegistry with token "tokenA" and the <configProvider>
    |<configProvider> |
    |' '              |
    |{}        |
    |{ test: 'test' }|
    |[]        |
    |['test']  |
    |null      |
    |true      |
    |false     |
    |0         |
    |-1        |
  Then an `invalidConfigurationProviderError` is thrown

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
  Then an `invalidTokenError` is thrown

Scenario: Create EnvRegistry with invalid value of dispatcherUrl
  Given a configuration with "tokenA" that allows access to this configuration
  When create new EnvRegistry with token "tokenA" and the <dispatcherUrl>
    |<dispatcherUrl> |
    |{}        |
    |{ test: 'test' }|
    |[]        |
    |['test']  |
    |null      |
    |true      |
    |false     |
    |0         |
    |-1        |
  Then an `invalidDispatcherUrlError` is thrown

Scenario: Create EnvRegistry with invalid value of repository
  Given a configuration with "tokenA" that allows access to this configuration
  When create new EnvRegistry with token "tokenA" and the <repository>
    |<repository>> |
    |{}        |
    |{ test: 'test' }|
    |[]        |
    |['test']  |
    |null      |
    |true      |
    |false     |
    |0         |
    |-1        |
  Then an `invalidRepositoryError` is thrown

  Scenario: Default repository is applied correctly while the creation of envRegistry, if no repository is provided
    Given a configuration with tokenA that allows access to this configuration
    And  "LocalStorageConfigurationProvider" is the configProvider used
    And  "testEnv" is default repository
    When create new EnvRegistry with tokenA
    Then EnvRegistry is created with "LocalStorageConfigurationProvider"
    And  "testEnv" repository is applied