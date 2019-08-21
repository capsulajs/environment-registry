
Scenario: Register is not supported yet for httpFile configProvider
   Given Environment Registry with environments method
   And   EnvRegistry is created with "httpFileConfigurationProvider"
   When  User calls register method
   Then  the error 'savingIsNotSupported' is returned

