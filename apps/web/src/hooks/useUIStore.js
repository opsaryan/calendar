import { useDispatch, useSelector } from 'react-redux';
import { onCloseDateModal, onOpenDateModal, toggleModal } from '../store';

export const useUIStore = () => {
  const dispatch = useDispatch();

  const { isDateModalOpen } = useSelector((state) => state.ui);

  const openDateModal = () => {
    dispatch(onOpenDateModal());
  };

  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  };

  const toggleDateModal = () => {
    dispatch(toggleModal());
  };

  return {
    // Properties
    isDateModalOpen,

    // Functions
    openDateModal,
    closeDateModal,
    toggleDateModal,
  };
};
