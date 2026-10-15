export const defaultState = {
  status: 'checking', //authenticated - not-authenticated - checking
  user: {},
  errorMessage: undefined,
};

export const authenticatedState = {
  status: 'authenticated', //authenticated - not-authenticated - checking
  user: {
    uid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    name: 'Testuser',
  },
  errorMessage: undefined,
};

export const notAuthenticatedState = {
  status: 'not-authenticated', //authenticated - not-authenticated - checking
  user: {},
  errorMessage: undefined,
};

export const notAuthenticatedStateWithErrorMessage = {
  status: 'not-authenticated', //authenticated - not-authenticated - checking
  user: {},
  errorMessage: 'Error message',
};
