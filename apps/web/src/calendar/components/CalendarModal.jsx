import { useEffect, useMemo, useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';
import ReactModal from 'react-modal';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import { useCalendarStore, useUIStore } from '../../hooks';

import 'react-datepicker/dist/react-datepicker.css';
import { getEnvVariables } from '../../helpers';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

if (getEnvVariables().MODE !== 'test') {
  // console.log(getEnvVariables());
  ReactModal.setAppElement('#root');
}

// Component:
export const CalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUIStore();
  const { activeEvent, startSavingEvent, setActiveEvent } = useCalendarStore();

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end: addHours(new Date(), 2),
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted) return '';

    return formValues.title.length > 1 ? 'is-valid' : 'is-invalid';
  }, [formValues.title, formSubmitted]);

  useEffect(() => {
    if (activeEvent !== null) {
      setFormValues({ ...activeEvent });
    }
  }, [activeEvent]);

  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onDateChange = (event, dateChanged) => {
    setFormValues({
      ...formValues,
      [dateChanged]: event,
    });
  };

  const onCloseModal = () => {
    closeDateModal();
    setActiveEvent(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const dateDifference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(dateDifference) || dateDifference <= 0) {
      Swal.fire('Incorrect dates', 'Check the end date is greater than start date', 'warning');
      return;
    }

    if (formValues.title.length <= 1) return;

    // save event
    await startSavingEvent(formValues);

    // close modal
    closeDateModal();

    // hide errors
    setFormSubmitted(false);
  };

  return (
    <ReactModal
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className='modal'
      overlayClassName='modal-fondo'
      closeTimeoutMS={200}
    >
      <h1> New Event </h1>
      <hr />
      <form className='container' onSubmit={onSubmit}>
        <div className='form-group mb-2 d-flex flex-column'>
          <label>Start date and hour</label>
          <DatePicker
            selected={formValues.start}
            className='form-control'
            onChange={(event) => onDateChange(event, 'start')}
            dateFormat='Pp'
            showTimeSelect
          />
        </div>

        <div className='form-group mb-2 d-flex flex-column'>
          <label>End date and hour</label>
          <DatePicker
            minDate={formValues.start}
            selected={formValues.end}
            className='form-control'
            onChange={(event) => onDateChange(event, 'end')}
            dateFormat='Pp'
            showTimeSelect
          />
        </div>

        <hr />
        <div className='form-group mb-2'>
          <label>Title and notes</label>
          <input
            type='text'
            className={`form-control ${titleClass}`}
            placeholder='Event title'
            name='title'
            autoComplete='off'
            value={formValues.title}
            onChange={onInputChange}
          />
          <small id='emailHelp' className='form-text text-muted'>
            A short description
          </small>
        </div>

        <div className='form-group mb-2'>
          <textarea
            type='text'
            className='form-control'
            placeholder='Notes'
            rows='5'
            name='notes'
            value={formValues.notes}
            onChange={onInputChange}
          ></textarea>
          <small id='emailHelp' className='form-text text-muted'>
            Additional Information
          </small>
        </div>

        <button type='submit' className='btn btn-outline-primary btn-block'>
          <i className='far fa-save'></i>
          <span> Save</span>
        </button>
      </form>
    </ReactModal>
  );
};
