import { useCalendarStore, useUIStore } from '../../hooks';

export const FabDelete = () => {
  const { isDateModalOpen } = useUIStore();
  const { startDeletingEvent, hasEventSelected } = useCalendarStore();

  const handleDeleteEvent = async () => await startDeletingEvent();

  return (
    <button
      aria-label='btn-delete'
      className='btn btn-danger fab-danger'
      onClick={handleDeleteEvent}
      style={{ display: hasEventSelected && !isDateModalOpen ? '' : 'none' }}
    >
      <i className='fas fa-trash-alt'></i>
    </button>
  );
};
