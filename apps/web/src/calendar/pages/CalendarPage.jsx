import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { FabAddNew, Navbar, CalendarEvent, CalendarModal, FabDelete } from '../';
import { Loader } from '../../auth/pages/Loader';
import { localizer } from '../../helpers';
import { useAuthStore, useCalendarStore, useUIStore } from '../../hooks';

export const CalendarPage = () => {
  const { user } = useAuthStore();
  const { events, setActiveEvent, startLoadingEvents, isLoadingEvents } = useCalendarStore();
  const { openDateModal } = useUIStore();
  const [lastview, setLastview] = useState(localStorage.getItem('lastview') || 'month');

  const eventStyleGetter = (event, start, end, isSelected) => {
    const isMyEvent = user.uid === event.user._id || user.uid === event.user.uid;

    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    };

    return { style };
  };

  const onDoubleClick = (event) => {
    openDateModal();
  };

  const onSelect = (event) => {
    setActiveEvent(event);
  };

  const onViewChanged = (event) => {
    // event is month, day, week , ...
    localStorage.setItem('lastview', event);
    setLastview(event);
  };

  useEffect(() => {
    startLoadingEvents();
  }, []);

  return (
    <>
      <Navbar />

      <Calendar
        localizer={localizer}
        events={events}
        defaultView={lastview}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 'calc(100vh - 100px)' }}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />

      <CalendarModal />

      <FabAddNew />

      <FabDelete />

      {isLoadingEvents && <Loader />}
    </>
  );
};
