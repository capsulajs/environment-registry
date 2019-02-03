

describe('Register test suite', () => {
  // TODO import configuration service and mock confService.entries()
  const configurationServiceResponseMock = [
    { develop: { accessPoints: [{ url: 'http://accessPoint/dev/service1'}, { url: 'http://accessPoint/dev/service2'}] }},
    { master: { accessPoints: [{ url: 'http://accessPoint/master/service1'}, { url: 'http://accessPoint/master/service2'}] }},
    { 'tag-1': { accessPoints: [{ url: 'http://accessPoint/tag-1/service1'}, { url: 'http://accessPoint/tag-1/service2'}] }},
    { 'tag-2': { accessPoints: [{ url: 'http://accessPoint/tag-2/service1'}] }},
  ];

  it('Subscribe to environments$ method returns all available envKeys and Envs', () => {
    environment$.subscribe();
  });

  it('Server error occurs when subscribing to environments$', () => {});
});
