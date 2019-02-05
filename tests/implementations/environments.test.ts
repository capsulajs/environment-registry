import EnvRegistry from '../../src/EnvRegistry';
import {
  ConfigurationServiceLocalStorage
} from '@capsulajs/capsulajs-configuration-service';

describe('Register test suite', () => {
  // TODO import configuration service and mock confService.entries()
  const configurationServiceResponseMock = [
    {
      key: 'develop',
      value: {
        accessPoints: [
          { url: 'http://accessPoint/dev/service1'},
          { url: 'http://accessPoint/dev/service2'}
        ]}},
    {
      key: 'master',
      value: {
        accessPoints: [
          { url: 'http://accessPoint/master/service1'},
          { url: 'http://accessPoint/master/service2'}
        ]}},
    {
      key: 'tag-1',
      value: {
        accessPoints: [
          { url: 'http://accessPoint/tag-1/service1'},
          { url: 'http://accessPoint/tag-1/service2'}
        ]}},
    {
      key: 'tag-2',
      value: {
        accessPoints: [
          { url: 'http://accessPoint/tag-2/service1'},
          { url: 'http://accessPoint/tag-2/service2'}
        ]}},
  ];
  const configurationService = new ConfigurationServiceLocalStorage('token');
  const repository = 'environmentRegistry';

  const envRegistry = new EnvRegistry(configurationService);

  beforeEach(async () => {
    localStorage.clear();
    await configurationService.createRepository({ repository });
    configurationServiceResponseMock.forEach(async ({ key, value }) => {
      console.log('key', key);
      await configurationService.save({ repository, key, value })
    });
  });

  it('Subscribe to environments$ method returns all available envKeys and Envs', () => {
    envRegistry.environments$({})
      .subscribe((x) => console.log(x));
  });

  it('Server error occurs when subscribing to environments$', () => {});
});
