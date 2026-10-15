import calendarApi from '../../src/api/calendarApi';

// Adapter that echoes the request back instead of hitting the network
const echoAdapter = async (config) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config });

describe('Tests calendar api', () => {
  beforeEach(() => localStorage.clear());

  test('BaseUrl should come from env config', () => {
    expect(calendarApi.defaults.baseURL).toBe('http://localhost/api');
  });

  test('Request should have x-token header', async () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    localStorage.setItem('token', testToken);

    const res = await calendarApi.post('/auth/login', {}, { adapter: echoAdapter });

    expect(res.config.headers['x-token']).toBe(testToken);
  });
});
