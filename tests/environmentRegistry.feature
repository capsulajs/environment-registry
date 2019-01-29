
Feature: register and environments$ methods


Scenario: Calling register method registers the environment with the provided envKey and env
  Given Environment Registry with register method
  When  User calls register method with by providing a valid envKey and env
  Then  Registration of the environment with this envKey is performed with success

Scenario: Calling register method without providing the envKey and env
  Given Environment Registry with register method
  When  User calls register method without providing the envKey and/or env
  Then  A relevant error is returned

Scenario: Calling register method with an envKey already registered
  Given Environment Registry with register method
  When  User calls register method an envKey and env already registered
//what do we expect in such case?
  Then  An error is returned? the existing env is replaced with the new one?

Scenario: Server error occurs after calling register method
  Given Environment Registry with register method
  When  User calls register method with valid request
  And   Server error occurs
  Then  A relevant error is returned

Scenario: Subscribe to environments$ method provides all registered environments
   Given Environment Registry with environments method
   When  User subscribes to environments method with valid request
   Then  User receives the information about all registered environments

Scenario: Server error occurs when subscribing to environments$
   Given Environment Registry with environments method
   When  User subscribes to environments method with valid request
   And   Server error occurs
   Then  A relevant error is returned
