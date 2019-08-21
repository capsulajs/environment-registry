
Scenario: Subscribe to environments$ method returns all available envKeys and Envs (scalecube configProvider)
   Given Environment Registry with environments method
   And   Several environments have been registered
   When  User subscribes to environments method with valid request
   Then  User receives all available envKeys and Envs
   And   If new environment is registered, subscribing to environments will return all envs including the last one