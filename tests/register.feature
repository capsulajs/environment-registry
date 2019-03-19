Background:
  Given a valid 'envKey' is a non empty string
  And   a valid 'env' is an object with a unique valid entry called 'services'
  And   a valid 'services' is an array of valid 'service' or an empty array
  And   a valid 'service' is an object with three valid entries called 'serviceName', 'url' and 'methods'
  And   a valid 'serviceName' is a non empty string
  And   a valid 'url' is a non empty string
  And   a valid 'methods' is an object whose entries are valid 'method' or an empty object
  And   a valid 'method' value is an object with a unique property called 'asyncModel' whose value is 'RequestResponse' or 'RequestStream'


Scenario: Calling register method registers the environment of the provided envKey and env
  Given Environment Registry with register method
  When  User calls register method by providing an object with a valid <envKey> and a valid <env>
    |<envKey>  | <env>                                                                                                                                                                    |
    |'develop' | {services: []}                                                                                                                                                           |
    |'develop' | {services: [{serviceName: 'service1', url: 'http://test.com', methods: {}}]}                                                                                             |
    |'develop' | {services: [{serviceName: 'service1', url: 'http://test.com', methods: {}}, {serviceName: 'service2', url: 'http://test.com', methods: {}}]}                             |
    |'develop' | {services: [{serviceName: 'service1', url: 'http://test.com', methods: {myTestMethod1: {asyncModel: 'RequestResponse'}}}]}                                               |
    |'develop' | {services: [{serviceName: 'service1', url: 'http://test.com', methods: {myTestMethod1: {asyncModel: 'RequestResponse'}, myTestMethod2: {asyncModel: 'RequestStream'}}}]} |
  Then  Registration of the environment is performed with success
  And   Subscribing to environments method returns the registered environment

Scenario: Calling register method with invalid request
  Given Environment Registry with register method
  When  User calls register method without providing exactly an object with a valid envKey and a valid env
  Then  The validation error 'registerRequestIsNotCorrect' is returned

Scenario: Calling register method with invalid envKey
  Given Environment Registry with register method
  And   A valid env
  When  User calls register method by providing the following values for <envKey>
         |<envKey>       |
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
  And   A valid envKey
  When  User calls register method by providing the following values for <env>
         |<env>                         |
         |null                          |
         |undefined                     |
         |123                           |
         |'test'                        |
         |[]                            |
         |['test']                      |
         |{}                            |
         |{ test: 'test'}               |
         |{ services: [], test: 'test' }|
  Then  The validation error 'envIsNotCorrect' is returned

Scenario: Calling register method with invalid env service.
  Given   Environment Registry with register method
  When    User calls register method by providing a valid envKey
  And     Env services contains an invalid <service>
      |<service>                                                                    |
      |{ url: 'http://test.com', methods: {}}                                       |
      |{ serviceName: 'service1', methods: {}}                                      |
      |{ serviceName: 'service1', url: 'http://test.com'}                           |
      |{ serviceName: 'service1', url: 'http://test.com', methods: {}, extraKey: 42}|
  Then    The validation error 'envIsNotCorrect' is returned

Scenario: Calling register method with a valid env, invalid env serviceName.
  Given   Environment Registry with register method
  When    User calls register method by providing a valid envKey
  And     Env contains a service with valid url and methods
  But     User provides the following values for the service <serviceName>
         |<serviceName>     |
         |null              |
         |undefined         |
         |123               |
         |[]                |
         |['test']          |
         |{}                |
         |{ test: 'test'}   |
  Then    The validation error 'envIsNotCorrect' is returned

Scenario: Calling register method with a valid env, invalid env serviceUrl.
  Given   Environment Registry with register method
  When    User calls register method by providing a valid envKey
  And     Env contains a service with valid serviceName and methods
  But     User provides the following values for the service <url>
         |<url>          |
         |null           |
         |undefined      |
         |123            |
         |[]             |
         |['test']       |
         |{}             |
         |{ test: 'test'}|
  Then    The validation error 'envIsNotCorrect' is returned

Scenario: Calling register method with a valid env, invalid env serviceMethods.
  Given   Environment Registry with register method
  When    User calls register method by providing a valid envKey
  And     Env contains a service with valid url and serviceName
  But     User provides the following values for the service <methods>
         |<methods>      |
         |null           |
         |undefined      |
         |123            |
         |'test'         |
         |[]             |
         |['test']       |
  Then    The validation error 'envIsNotCorrect' is returned

Scenario: Calling register method with a valid env, env service method entry doesn't comply with the model.
  Given   Environment Registry with register method
  When    User calls register method by providing a valid envKey
  And     Env contains a service with valid url and serviceName
  And     The service methods is an object
  But     method <value> is not valid
         |<value>                                            |
         |null                                               |
         |undefined                                          |
         |123                                                |
         |'test'                                             |
         |[]                                                 |
         |['test']                                           |
         |{ test: 'test'}                                    |
         |{ asyncModel: [] }                                 |
         |{ asyncModel: {} }                                 |
         |{ asyncModel: 42 }                                 |
         |{ asyncModel: 'random' }                           |
         |{ asyncModel: null }                               |
         |{ asyncModel: undefined }                          |
         |{ asyncModel: 'RequestResponse', otherProp: 123 }  |
  Then   The validation error 'envIsNotCorrect' is returned

Scenario: Calling register method with an envKey already registered
  Given Environment Registry with register method
  When  User calls register method with an object containing an envKey already registered
  Then  The value of the existing env is updated with the new one
  And   Subscribing to environments method returns the updated environment

 //For future implementation
Scenario: Server error occurs after calling register method
  Given Environment Registry with register method
  When  User calls register method with valid request
  And   Server error occurs
  Then  A relevant error is returned
