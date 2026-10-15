export const newEvent = {
  id: '63b898d1f28aff19002a1bb33',
  title: 'Third event',
  notes: 'Testing event',
  start: '2023-02-02T20:30:00.000Z',
  end: '2023-02-02T22:30:00.000Z',
};

export const events = [
  {
    id: '63b898d1f28aff19002a1bb11',
    title: 'Record song',
    notes: 'Record new song for album',
    start: '2023-01-02T20:30:00.000Z',
    end: '2023-01-02T22:30:00.000Z',
  },
  {
    id: '63b898f1f28aff19002a1bc22',
    title: 'Practice react',
    start: '2023-01-18T22:30:00.000Z',
    end: '2023-01-20T00:00:00.000Z',
  },
];

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null,
};

export const calendarWithEventsState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: null,
};

export const calendarWithActiveEventState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: { ...events[0] },
};
