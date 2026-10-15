import { createSlice } from '@reduxjs/toolkit';
/*
Event structure example
const tempEvent = {
  id: new Date().getTime(),
  title: 'Birthday',
  notes: 'Buy cake',
  start: new Date(),
  end: addHours(new Date(), 2),
  bgColor: 'fafafa',
  user: {
    id: '123',
    name: 'Juna',
  },
};
*/

const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null,
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    activateEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },

    addNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },

    updateEvent: (state, { payload }) => {
      state.events = state.events.map((event) => {
        if (event.id === payload.id) return payload;

        return event;
      });
    },

    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter((event) => event.id !== state.activeEvent.id);
        state.activeEvent = null;
      }
    },

    loadEvents: (state, { payload = [] }) => {
      state.isLoadingEvents = false;
      // state.events = [...events, payload];
      payload.forEach((event) => {
        const alreadyExists = state.events.some((e) => e.id === event.id);

        if (!alreadyExists) {
          state.events.push(event);
        }
      });
    },

    cleanEventsOnLogout: (state) => {
      return Object.assign(state, initialState);
    },
  },
});

export const {
  activateEvent,
  addNewEvent,
  updateEvent,
  onDeleteEvent,
  loadEvents,
  cleanEventsOnLogout,
} = calendarSlice.actions;
