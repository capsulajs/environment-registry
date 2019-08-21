
Scenario: Subscribe to environments$ method returns all available envKeys and Envs (LocalStorage configProvider)
   Given Environment Registry with environments method
   And   Several environments have been registered
   When  User subscribes to environments method with valid request
   Then  User receives all available envKeys and Envs
   And   If new environment is registered, subscribing to environments will return all envs including the last one

  //For future implementation
Scenario: Server error occurs when subscribing to environments$
   Given Environment Registry with environments method
   When  User subscribes to environments method with valid request
   And   Server error occurs
   Then  A relevant error is returned
