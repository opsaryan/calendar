import { act } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { calendarApi } from '../../src/api';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store';
import { defaultState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';

const getMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: {
      auth: { ...initialState },
    },
  });
};

describe('Tests on useAuthStore custom hook', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => jest.restoreAllMocks());

  test('should return default status and functions', () => {
    const mockedStore = getMockStore(defaultState);

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>,
    });

    expect(result.current).toEqual({
      ...defaultState,
      startLogin: expect.any(Function),
      startRegister: expect.any(Function),
      checkAuthToken: expect.any(Function),
      startLogout: expect.any(Function),
    });
  });

  test('should start login with startLogin', async () => {
    const mockStore = getMockStore(notAuthenticatedState);

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const apiSpy = jest.spyOn(calendarApi, 'post').mockResolvedValue({
      data: {
        ok: true,
        uid: testUserCredentials.uid,
        name: testUserCredentials.name,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
    });

    await act(async () => {
      await result.current.startLogin(testUserCredentials);
    });

    expect(apiSpy).toHaveBeenCalledWith('/auth/login', {
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: {
        name: 'Test User',
        uid: expect.any(String),
      },
    });

    expect(localStorage.getItem('token')).toEqual(expect.any(String));
    expect(localStorage.getItem('token').length).toBeGreaterThan(1);
    expect(localStorage.getItem('token-init-time')).toEqual(expect.any(String));
  });

  test('startLogin should fail the authentication', async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    jest.spyOn(calendarApi, 'post').mockRejectedValue({
      response: { status: 400, data: { ok: false, msg: 'The user does not exist' } },
    });

    await act(async () => {
      await result.current.startLogin({ email: 'somebaduser@gmail.com', password: '9897654A' });
    });

    const { errorMessage, status, user } = result.current;

    expect(localStorage.getItem('token')).toBeNull();

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: expect.any(String),
      status: 'not-authenticated',
      user: {},
    });

    await waitFor(() => expect(result.current.errorMessage).toBe(undefined));
  });

  test('startRegister should create an user', async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const apiSpy = jest.spyOn(calendarApi, 'post').mockResolvedValue({
      data: {
        ok: true,
        uid: '63c5c6542d1274fd19867647',
        name: 'Test user 2',
        token: 'NDciLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjc0MTQ0NzY1LCJleHAiOjE2NzQxNTE5NjV9',
      },
    });

    await act(async () => {
      await result.current.startRegister({
        name: 'Test User 2',
        email: 'someuser@gmail.com',
        password: '9893D254A',
      });
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test user 2', uid: '63c5c6542d1274fd19867647' },
    });

    apiSpy.mockRestore();
  });

  test('startRegister should fail when user already exists', async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    jest.spyOn(calendarApi, 'post').mockRejectedValue({
      response: { status: 400, data: { ok: false, msg: 'One user exists with that email' } },
    });

    // user that already exists
    await act(async () => {
      await result.current.startRegister({ ...testUserCredentials });
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: 'One user exists with that email',
      status: 'not-authenticated',
      user: {},
    });
  });

  test('checkAuthToken should fail if no token provided', async () => {
    // localStorage.clear(); already on beforeEach
    const mockedStore = getMockStore({ defaultState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>,
    });

    await act(async () => {
      result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'not-authenticated',
      user: {},
    });
  });

  test('checkAuthToken should renew token', async () => {
    localStorage.setItem('token', 'NiIsInR5cCI6IkpXVCJ9');

    const mockStore = getMockStore({ ...defaultState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const apiSpy = jest.spyOn(calendarApi, 'get').mockResolvedValue({
      data: {
        ok: true,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        msg: 'Renew',
        uid: '63c5c6542d1274fd19867647',
        name: 'Test User',
      },
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test User', uid: '63c5c6542d1274fd19867647' },
    });

    expect(localStorage.getItem('token')).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    apiSpy.mockRestore();
  });

  test('checkAuthToken should not renew an expired token', async () => {
    localStorage.setItem('token', '0_Mj78d8s4aimMQAjo2hRH1zyWTJt2oDT2bC9s6_qGs');
    const mockStore = getMockStore({ ...defaultState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    jest.spyOn(calendarApi, 'get').mockRejectedValue({
      response: { status: 401, data: { ok: false, msg: 'Token not valid or expired' } },
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({ ...notAuthenticatedState });

    expect(localStorage.getItem('token')).toBeNull();
  });

  test('should startLogout', () => {
    localStorage.setItem('token', '0_Mj78d8s4aimMQAjo2hRH1zyWTJt2oDT2bC9s6_qGs');
    localStorage.setItem('token-init-time', new Date().getTime());

    const mockStore = getMockStore({ ...defaultState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    act(() => {
      result.current.startLogout();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({ ...notAuthenticatedState });
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('token-init-time')).toBeNull();
  });
});
