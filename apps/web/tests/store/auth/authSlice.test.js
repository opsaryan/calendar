import {
  authSlice,
  checking,
  clearErrorMessage,
  login,
  logout,
} from '../../../src/store/auth/authSlice';

import {
  authenticatedState,
  defaultState,
  notAuthenticatedState,
  notAuthenticatedStateWithErrorMessage,
} from '../../fixtures/authStates';
import { testUserCredentials } from '../../fixtures/testUser';

describe('Tests on auth slice', () => {
  test('should return initial state', () => {
    expect(authSlice.getInitialState()).toEqual(defaultState);
  });

  test('Should check status', () => {
    const state = authSlice.reducer(notAuthenticatedState, checking());
    expect(state).toEqual(defaultState);
  });

  test('Should login', () => {
    const state = authSlice.reducer(defaultState, login(testUserCredentials));

    expect(state).toEqual({
      status: 'authenticated',
      user: testUserCredentials,
      errorMessage: undefined,
    });
  });

  test('Should logout no errors', () => {
    const state = authSlice.reducer(authenticatedState, logout());
    expect(state).toEqual(notAuthenticatedState);
  });

  test('Should logout with error message', () => {
    const errorMsg = 'Not valid credentials';
    const state = authSlice.reducer(authenticatedState, logout(errorMsg));

    expect(state.errorMessage.length).toBeGreaterThan(1);
    expect(state).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage: errorMsg,
    });
  });

  test('should clear error message', () => {
    const state = authSlice.reducer(notAuthenticatedStateWithErrorMessage, clearErrorMessage());

    expect(state).toEqual(notAuthenticatedState);
  });
});
