
Scenario: Subscribe to environments$ method returns all available envKeys and Envs (httpServer configProvider)
   Given Environment Registry with environments method
   And   Several environments
   When  User subscribes to environments method with valid request
   Then  User receives all available envKeys and Envs
