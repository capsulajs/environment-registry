import axios from 'axios';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { EnvRegistry } from '../../../src';
import { tag2Data, baseUrl, baseRepository, baseApiKey } from '../../helpers/mocks';
import { Env } from '../../helpers/types';

describe('Register test suite (scalecube provider)', () => {
  it('Calling register sends the correct data to scalecube server', () => {
    expect.assertions(4);
    let axiosCalls = 0;
    // @ts-ignore
    axios.post = jest.fn((url, data) => {
      axiosCalls++;
      switch (axiosCalls) {
        case 1: {
          expect(url).toEqual(`${baseUrl}/configuration/createRepository`);
          expect(data).toEqual({ apiKey: baseApiKey, repository: baseRepository });
          break;
        }
        case 2: {
          expect(url).toEqual(`${baseUrl}/configuration/createEntry`);
          expect(data).toEqual({
            apiKey: baseApiKey,
            repository: baseRepository,
            key: tag2Data.envKey,
            value: tag2Data.env,
          });
          break;
        }
        case 3: {
          expect(false).toBeTruthy();
          break;
        }
      }
      return Promise.resolve({ data: {} });
    });

    const envRegistry = new EnvRegistry<Env>({
      token: baseApiKey,
      configProvider: configurationTypes.scalecube,
      dispatcherUrl: baseUrl,
      repository: baseRepository,
    });
    return envRegistry.register(tag2Data);
  });
});
