import { addHours } from 'date-fns';
import { useCalendarStore, useUIStore } from '../../hooks';

export const FabAddNew = () => {
  const { openDateModal } = useUIStore();

  const { setActiveEvent } = useCalendarStore();

  const handleClickNewEvent = () => {
    setActiveEvent({
      title: '',
      notes: '',
      start: new Date(),
      end: addHours(new Date(), 2),
      bgColor: '#fafafa',
      user: {
        _id: '123',
        name: 'Juna',
      },
    });

    openDateModal();
  };

  return (
    <button className='btn btn-primary fab' onClick={handleClickNewEvent}>
      <i className='fas fa-plus'></i>
    </button>
  );
};
