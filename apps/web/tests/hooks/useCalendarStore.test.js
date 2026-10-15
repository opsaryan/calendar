import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { calendarApi } from '../../src/api';
import { useCalendarStore } from '../../src/hooks/useCalendarStore';
import { authSlice, calendarSlice } from '../../src/store';
import {
  authenticatedState,
  calendarWithActiveEventState,
  calendarWithEventsState,
  defaultState,
  initialState,
  newEvent,
  events as fixtureEvents,
} from '../fixtures';

const createMockStore = (calInitialState = {}, authInitialState = {}) => {
  return configureStore({
    reducer: {
      calendar: calendarSlice.reducer,
      auth: authSlice.reducer,
    },
    preloadedState: {
      calendar: { ...calInitialState },
      auth: { ...authInitialState },
    },
  });
};

const convertStringEventsToDateMock = () => [...fixtureEvents];
jest.mock('../../src/helpers/convertEventsToDate', () => {
  return {
    convertStringEventsToDate: convertStringEventsToDateMock,
  };
});

describe('Tests on useCalendarStore custom hook', () => {
  afterAll(() => jest.restoreAllMocks());

  test('Should return default store', () => {
    const mockStore = createMockStore(initialState, defaultState);

    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(result.current).toEqual({
      ...initialState,
      hasEventSelected: false,
      setActiveEvent: expect.any(Function),
      startSavingEvent: expect.any(Function),
      startDeletingEvent: expect.any(Function),
      startLoadingEvents: expect.any(Function),
    });
  });

  test('Should setActiveEvent', () => {
    const mockStore = createMockStore(calendarWithEventsState, defaultState);
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    act(() => result.current.setActiveEvent(newEvent));
    const { activeEvent, hasEventSelected } = result.current;

    expect(activeEvent).toEqual(newEvent);
    expect(hasEventSelected).toBe(true);
  });

  test('Should create a new event', async () => {
    const mockStore = createMockStore(calendarWithActiveEventState, authenticatedState);
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    jest.spyOn(calendarApi, 'post').mockResolvedValue({
      data: {
        ok: true,
        event: {
          title: 'Third event',
          notes: 'Testing event',
          start: '2023-02-02T20:30:00.000Z',
          end: '2023-02-02T22:30:00.000Z',
          user: '63b89760f28aff19002a1bb1',
          id: '63c9d2cc6c29e1cd6117b45d',
        },
        msg: 'Event created',
      },
    });

    const eventToCreate = { ...newEvent };
    delete eventToCreate.id;

    await act(async () => {
      await result.current.startSavingEvent(eventToCreate);
    });

    const { activeEvent, events, hasEventSelected } = result.current;

    expect(activeEvent).toBeNull();
    expect(events.length).toBeGreaterThan(2);
    expect(events.at(-1).title).toBe(eventToCreate.title);
    expect(hasEventSelected).toBe(false);
  });

  test('Should update and existing event', async () => {
    const mockStore = createMockStore(calendarWithActiveEventState, authenticatedState);
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    jest.spyOn(calendarApi, 'put').mockResolvedValue({
      data: {
        ok: true,
        event: {
          title: 'Sintonizar 2',
          notes: 'Mejor cancion',
          start: '2023-01-19T23:29:59.961Z',
          end: '2023-01-29T08:24:00.000Z',
          user: '63b89760f28aff19002a1bb1',
          id: '63b898d1f28aff19002a1bb11',
        },
        msg: 'Event updated',
      },
    });

    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent, id: '63b898d1f28aff19002a1bb11' });
    });

    const { events } = result.current;

    expect(events[0]).toEqual({
      id: '63b898d1f28aff19002a1bb11',
      title: 'Third event',
      notes: 'Testing event',
      start: '2023-02-02T20:30:00.000Z',
      end: '2023-02-02T22:30:00.000Z',
      user: expect.any(Object),
    });

    expect(events.length).toBe(2);
  });

  test('Should startDeletingEvent', async () => {
    const mockStore = createMockStore(calendarWithActiveEventState, authenticatedState);
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    jest.spyOn(calendarApi, 'delete').mockResolvedValue({
      data: {
        ok: true,
        event: '63b898d1f28aff19002a1bb11',
        msg: 'Event deleted',
      },
    });

    await act(async () => {
      await result.current.startDeletingEvent();
    });

    const { events, hasEventSelected, activeEvent } = result.current;

    expect(events.length).toBeLessThanOrEqual(1);
    expect(events[0].id).not.toBe('63b898d1f28aff19002a1bb11');
    expect(hasEventSelected).toBe(false);
    expect(activeEvent).toBeNull();
  });

  test('Should startLoadingEvents', async () => {
    const mockStore = createMockStore(initialState, authenticatedState);
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    jest.spyOn(calendarApi, 'get').mockResolvedValue({
      data: {
        ok: true,
        events: [...fixtureEvents],
        msg: 'getEvents',
      },
    });

    await act(async () => {
      await result.current.startLoadingEvents();
    });

    const { events, isLoadingEvents } = result.current;

    expect(events.length).toBeGreaterThan(0);
    expect(events).toEqual(fixtureEvents);
    expect(isLoadingEvents).toBe(false);
  });
});
