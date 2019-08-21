
Scenario: Register is not supported yet for localFile configProvider
   Given Environment Registry with environments method
   And   EnvRegistry is created with "localFileConfigurationProvider"
   When  User calls register method
   Then  the error 'savingIsNotSupported' is returned