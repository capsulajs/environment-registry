Background:
  Given Environment Registry with register method
  And   a valid 'envKey' is a non empty string
  And   an 'env' can be anything


Scenario: Calling register method registers the environment of the provided envKey and env
  When  User calls register method the <envKey> and <env>
    |<envKey>  | <env>      |                                                                                                                                                              |
    |'develop' | environment|
    |'develop' | ' '        |
  Then  Registration of the environment is performed with success
  And   Subscribing to environments method returns the registered environment

Scenario: Calling register method with an envKey already registered
  Given An environment with envKey 'develop' is registered in Environment Registry
  When  User calls register method with valid env and envKey 'develop'
  Then  The value of the existing env is updated with the new one
  And   Subscribing to environments method returns the updated environment

Scenario: Calling register method with invalid request
  When  User calls register method without providing exactly an object with a valid envKey and a valid env
  Then  The validation error 'registerRequestIsNotCorrect' is returned

Scenario: Calling register method with invalid envKey
  When  User calls register method with valid env and with the following <envKey>
         |<envKey>       |
         |null           |
         |undefined      |
         |123            |
         |[]             |
         |['test']       |
         |{}             |
         |{ test: 'test'}|
  Then  The validation error 'envKeyIsNotCorrect' is returned


 //For future implementation
Scenario: Server error occurs after calling register method
  Given Environment Registry with register method
  When  User calls register method with valid request
  And   Server error occurs
  Then  A relevant error is returned
