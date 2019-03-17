
Scenario: Calling register method registers the environment of the provided envKey and env
  Given Environment Registry with register method
  When  User calls register method with by providing a valid envKey and env
  Then  Registration of the environment with this envKey is performed with success
  And   Subscribing to environments method returns the registered environment

Scenario: Calling register method with invalid envKey
  Given Environment Registry with register method
  When  User calls register method by providing the following values for envKey
         |envKey         |
         |null           |
         |undefined      |
         |123            |
         |[]             |
         |['test']       |
         |{}             |
         |{ test: 'test'}|
  Then  The validation error 'envKeyIsNotCorrect' is returned

Scenario: Calling register method with invalid env
  Given Environment Registry with register method
  When  User calls register method by providing the following values for env
         |env            |
         |null           |
         |undefined      |
         |123            |
         |'test'         |
         |[]             |
         |['test']       |
         |{}             |
         |{ test: 'test'}|
         |{ services: [] }|
  Then  The validation error 'envIsNotCorrect' is returned

Scenario: Calling register method with a valid env, invalid env serviceName.
  Given   Environment Registry with register method
  When    User calls register method by providing a valid envKey
  And     Env modelis in the correct structure
  But     User provides the following values for <serviceName>
         |serviceName    |
         |null           |
         |undefined      |
         |123            |
         |'test'         |
         |[]             |
         |['test']       |
         |{}             |
         |{ test: 'test'}|
         |{ services: [] }|
  Then    Validation error 'env serviceName should be a string' is returned

Scenario: Calling register method with a valid env, invalid env serviceUrl.

Scenario: Calling register method with a valid env, invalid env serviceMethods.

Scenario: Calling register method with a valid env, env method value does not comply with the model.  

Scenario: Calling register method with an envKey already registered
  Given Environment Registry with register method
  When  User calls register method an envKey and env already registered
  Then  The value of the existing env is updated with with the new one
  And   Subscribing to environments method returns the updated environment

 //For future implementation
Scenario: Server error occurs after calling register method
  Given Environment Registry with register method
  When  User calls register method with valid request
  And   Server error occurs
  Then  A relevant error is returned
