export const configurationServiceResponseMock = [
  {
    key: 'develop',
    value: {
      accessPoints: [
        { url: 'http://accessPoint/dev/service1'},
        { url: 'http://accessPoint/dev/service2'}
      ]
    }},
  {
    key: 'master',
    value: {
      accessPoints: [
        { url: 'http://accessPoint/master/service1'},
        { url: 'http://accessPoint/master/service2'}
      ]
    }},
  {
    key: 'tag-1',
    value: {
      accessPoints: [
        { url: 'http://accessPoint/tag-1/service1'},
        { url: 'http://accessPoint/tag-1/service2'}
      ]
    }},
  {
    key: 'tag-2',
    value: {
      accessPoints: [
        { url: 'http://accessPoint/tag-2/service1'},
        { url: 'http://accessPoint/tag-2/service2'}
      ]
    }
  }
];
