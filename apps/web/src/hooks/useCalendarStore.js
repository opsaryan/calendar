import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { calendarApi } from '../api';
import { convertStringEventsToDate } from '../helpers/';
import { activateEvent, addNewEvent, loadEvents, onDeleteEvent, updateEvent } from '../store';

export const useCalendarStore = () => {
  const dispatch = useDispatch();

  const { events, activeEvent, isLoadingEvents } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(activateEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        // Updating event
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);

        dispatch(updateEvent({ ...calendarEvent, user }));
      } else {
        // Creating event
        const { data } = await calendarApi.post('/events/', calendarEvent);

        dispatch(addNewEvent({ ...calendarEvent, id: data.event.id, user: user }));
      }
      //
    } catch (error) {
      // console.log(error);
      Swal.fire({
        title: 'Error saving event',
        html: error.response?.data?.msg,
        timer: 3000,
        icon: 'error',
      });
    }
  };

  const startDeletingEvent = async () => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);

      dispatch(onDeleteEvent());

      Swal.fire({ html: 'Event deleted', icon: 'info', timer: 1000, timerProgressBar: true });
      //
    } catch (error) {
      // console.log(error);

      Swal.fire({ title: 'Error', html: error.response?.data?.msg, icon: 'error', timer: 2000 });
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get('/events/');
      const events = convertStringEventsToDate(data.events);

      dispatch(loadEvents(events));
      //
    } catch (error) {
      console.log('Error loading events\n', error);
    }
  };

  return {
    // Properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    isLoadingEvents,

    // Functions
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
  };
};
