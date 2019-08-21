
Scenario: Calling register sends the correct data to scalecube server
   Given Environment Registry with environments method
   And   EnvRegistry is created with "scalecubeConfigurationProvider"
   When  User calls register method
   Then  Registration of the environment is performed with success