Background:
  Given Environment Registry with register method
  And   a valid 'envKey' is a non empty string
  And   an 'env' can be anything


Scenario: Calling register method registers the environment of the provided envKey and env
  Given An environment registry
  When  User calls register method with the <envKey> and <env>
    |<envKey>  | <env>          |
    |'develop' | null           |
    |'develop' | 123            |
    |'develop' | 'test'         |
    |'develop' | []             |
    |'develop' | ['test']       |
    |'develop' | {}             |
    |'develop' | {test: 'test'} |
  Then  Registration of the environment is performed with success
  And   Subscribing to environments method returns the registered environment

Scenario: Calling register method with undefined env deletes the environment of the provided envKey
  Given An environment registry
  When  User calls register method with the <envKey> and <env>
    |<envKey>  | <env>          |
    |'develop' | 'develop'      |
  And  Registration of the environment is performed with success
  And  Subscribing to environments method returns the registered environment
  And User calls again register method with the <envKey> and <env>
    |<envKey>  | <env>          |
    |'develop' | undefined      |
  Then  Registration of the environment is performed with success
  And   This environment is delete from the registry
  And   Subscribing to environments method doesn't return the environment

Scenario: Calling register method with an envKey already registered
  Given An environment with envKey 'develop' is registered in Environment Registry
  And   The environment 'env' property is `undefined`
  When  User calls register method with valid env '123' and envKey 'develop'
  Then  The value of the existing env is updated with the new one
  And   Subscribing to environments method returns 123

Scenario: Calling register method with invalid request
  When  User calls register method without providing exactly an object with a valid envKey and an env
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
