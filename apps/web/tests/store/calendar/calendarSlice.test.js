import {
  activateEvent,
  addNewEvent,
  calendarSlice,
  cleanEventsOnLogout,
  loadEvents,
  onDeleteEvent,
  updateEvent,
} from '../../../src/store/calendar/calendarSlice';

import {
  calendarWithActiveEventState,
  calendarWithEventsState,
  events,
  initialState,
  newEvent,
} from '../../fixtures/calendarStates';

describe('Tests calendar slice', () => {
  test('should return initial state', () => {
    expect(calendarSlice.getInitialState()).toEqual(initialState);
  });

  test('should activate event', () => {
    const state = calendarSlice.reducer(initialState, activateEvent(events[0]));

    expect(state.activeEvent).toEqual(expect.any(Object));
    expect(state.activeEvent).toEqual(events[0]);
  });

  test('should add a new event', () => {
    const state = calendarSlice.reducer(calendarWithActiveEventState, addNewEvent(newEvent));

    expect(state.events.length).toBe(3);
    expect(state).toEqual({ ...calendarWithEventsState, events: [...events, newEvent] });
  });

  test('Should update event', () => {
    const newEventUpdate = {
      id: '63b898f1f28aff19002a1bc22',
      title: 'Practice new techs',
      notes: 'Now the event has notes',
      start: '2023-06-18T22:30:00.000Z',
      end: '2023-06-20T00:00:00.000Z',
    };

    const state = calendarSlice.reducer(calendarWithEventsState, updateEvent(newEventUpdate));

    expect(state.events).toContain(newEventUpdate);
    expect(state.events.at(-1)).toEqual(newEventUpdate);
  });

  test('should delete event from events and activeEvent', () => {
    // does not require payload because uses the active event
    const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());

    expect(state.activeEvent).toBeNull();
    expect(state.events.length).toBeLessThan(events.length);
  });

  test('should load events', () => {
    const state = calendarSlice.reducer(initialState, loadEvents(events));

    expect(state).toEqual(calendarWithEventsState);
    expect(state.events.length).toBeGreaterThan(0);

    // Reload events, should not repeat events
    const newState = calendarSlice.reducer(state, loadEvents);
    expect(newState).toEqual(calendarWithEventsState);
    expect(newState).toEqual(state);
    expect(newState.events.length).toBe(state.events.length);
  });

  test('should clean events on logout', () => {
    const state = calendarSlice.reducer(calendarWithActiveEventState, cleanEventsOnLogout());
    expect(state).toEqual(initialState);
  });
});
