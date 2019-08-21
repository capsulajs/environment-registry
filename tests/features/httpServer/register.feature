
Scenario: Register is not supported yet for httpServer configProvider
   Given Environment Registry with environments method
   And   EnvRegistry is created with "httpServerConfigurationProvider"
   When  User calls register method
   Then  the error 'savingIsNotSupported' is returned