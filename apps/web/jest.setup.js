import { TextEncoder, TextDecoder } from 'node:util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

// import.meta.env is not available in jest, tests use a fixed config
jest.mock('./src/helpers/getEnvVariables', () => ({
  getEnvVariables: () => ({ MODE: 'test', VITE_API_URL: 'http://localhost/api' }),
}));
