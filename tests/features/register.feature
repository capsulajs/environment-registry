Background:
  Given Environment Registry with register method
  And   a valid 'envKey' is a non empty string
  And   an 'env' can be anything


Scenario: Calling register method registers the environment of the provided envKey and env
  Given An environment registry of <type>
  When  User calls register method with the <envKey> and <env>
    |<envKey>  | <env>          | <type>     |
    |'develop' | undefined      | any        |
    |'develop' | null           | any        |
    |'develop' | 123            | number     |
    |'develop' | 'test'         | string     |
    |'develop' | []             | any[]      |
    |'develop' | ['test']       | string[]   |
    |'develop' | {}             | object     |
    |'develop' | {test: 'test'} | object     |
  Then  Registration of the environment is performed with success
  And   Subscribing to environments method returns the registered environment

Scenario: Calling register method with an envKey already registered
  Given An environment with envKey 'develop' is registered in Environment Registry
  And   The environment 'env' property is `undefined`
  When  User calls register method with valid env and envKey 'develop'
  And   with env '123'
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
