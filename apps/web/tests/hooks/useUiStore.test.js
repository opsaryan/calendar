import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useUIStore } from '../../src/hooks/useUIStore';
import { uiSlice } from '../../src/store';

const getMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
    },
    preloadedState: {
      ui: { ...initialState },
    },
  });
};

describe('Test on useUiStore hook', () => {
  test('Should return default properties and functions', () => {
    const mockStore = getMockStore({
      isDateModalOpen: false,
    });

    const { result } = renderHook(() => useUIStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(result.current).toEqual({
      isDateModalOpen: false,
      openDateModal: expect.any(Function),
      closeDateModal: expect.any(Function),
      toggleDateModal: expect.any(Function),
    });
  });

  test('OpenDateModal should change isDateModalOpen to true', () => {
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUIStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const { openDateModal } = result.current;

    act(() => {
      openDateModal();
    });

    expect(result.current.isDateModalOpen).toBe(true);
  });

  test('closeDateModal should close modal', () => {
    const mockStore = getMockStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUIStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    act(() => {
      result.current.closeDateModal();
    });

    expect(result.current.isDateModalOpen).toBe(false);
  });

  test('toggleDateModal should change isDateModalOpen value', () => {
    const mockedStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUIStore(), {
      wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>,
    });

    const { isDateModalOpen, toggleDateModal } = result.current;

    act(() => toggleDateModal());
    expect(result.current.isDateModalOpen).toBe(!isDateModalOpen);

    act(() => toggleDateModal());
    expect(result.current.isDateModalOpen).toBe(isDateModalOpen);
  });
});
