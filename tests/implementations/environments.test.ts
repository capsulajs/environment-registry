import EnvRegistry from '../../src/EnvRegistry';
import { environments } from './mocks';

describe('Register test suite', () => {
  const repository = 'environmentRegistry';
  let envRegistry: EnvRegistry;

  beforeEach(async () => {
    localStorage.clear();
    envRegistry = new EnvRegistry('token');
    await envRegistry.register({ envKey: 'develop', env: environments.develop});
    await envRegistry.register({ envKey: 'master', env: environments.master});
    await envRegistry.register({ envKey: 'tag-1', env: environments['tag-1']});
  });

  it('Subscribe to environments$ method returns all available envKeys and Envs', async (done) => {
    expect.assertions(7);
    let updates = 0;
    envRegistry.environments$({})
      .subscribe((data) => {
        updates = updates + 1;
        switch (updates) {
          case 1:
            expect(data).toEqual({
              key: 'develop',
              value: {
                accessPoints: [
                  { url: 'http://accessPoint/dev/service1' },
                  { url: 'http://accessPoint/dev/service2' }
                ]
              }
            });
            break;
          case 2:
            expect(data).toEqual({
              key: 'master',
              value: {
                accessPoints: [
                  { url: 'http://accessPoint/master/service1' },
                  { url: 'http://accessPoint/master/service2' }
                ]
              }
            });
            break;
          case 3:
            expect(data).toEqual({
              key: 'tag-1',
              value: {
                accessPoints: [
                  { url: 'http://accessPoint/tag-1/service1' },
                  { url: 'http://accessPoint/tag-1/service2' }
                ]
              }
            });
            break;
          default: break;
        }
      });
    await envRegistry.register({ envKey: 'tag-2', env: environments['tag-2']});
    updates = 0;
    envRegistry.environments$({})
      .subscribe((data) => {
        updates = updates + 1;
        switch (updates) {
          case 1:
            expect(data).toEqual({
              key: 'develop',
              value: {
                accessPoints: [
                  { url: 'http://accessPoint/dev/service1' },
                  { url: 'http://accessPoint/dev/service2' }
                ]
              }
            });
            break;
          case 2:
            expect(data).toEqual({
              key: 'master',
              value: {
                accessPoints: [
                  { url: 'http://accessPoint/master/service1' },
                  { url: 'http://accessPoint/master/service2' }
                ]
              }
            });
            break;
          case 3:
            expect(data).toEqual({
              key: 'tag-1',
              value: {
                accessPoints: [
                  { url: 'http://accessPoint/tag-1/service1' },
                  { url: 'http://accessPoint/tag-1/service2' }
                ]
              }
            });
            break;
          case 4:
            expect(data).toEqual({
              key: 'tag-2',
              value: {
                accessPoints: [
                  { url: 'http://accessPoint/tag-2/service1' },
                  { url: 'http://accessPoint/tag-2/service2' }
                ]
              }
            });
            done();
            break;
          default: break;
        }
      });
  });

  // it('Server error occurs when subscribing to environments$', () => {});
});
