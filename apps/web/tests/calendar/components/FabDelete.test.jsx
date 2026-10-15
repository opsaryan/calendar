import { fireEvent, render, screen } from '@testing-library/react';
import { FabDelete } from '../../../src/calendar/components/FabDelete';
import { useCalendarStore, useUIStore } from '../../../src/hooks';

jest.mock('../../../src/hooks/');

describe('Tests on FabDelete component', () => {
  const mockStartDeletingEvent = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test('Should render component and not display the delete button', () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: false,
    });

    useUIStore.mockReturnValue({
      isDateModalOpen: true,
    });

    render(<FabDelete />);

    const button = screen.getByLabelText('btn-delete');

    expect(button.classList).toContain('btn');
    expect(button.classList).toContain('btn-danger');
    expect(button.classList).toContain('fab-danger');

    expect(button.style.display).toBe('none');
  });

  test('Should render component and show the delete button', () => {
    useCalendarStore.mockReturnValue({ hasEventSelected: true });
    useUIStore.mockReturnValue({ isDateModalOpen: false });

    render(<FabDelete />);
    const button = screen.getByLabelText('btn-delete');

    expect(button.style.display).toBe('');
  });

  test('Should call startDeletingEvent when button pressed', () => {
    useCalendarStore.mockReturnValue({
      startDeletingEvent: mockStartDeletingEvent,
      hasEventSelected: true,
    });
    useUIStore.mockReturnValue({ isDateModalOpen: false });

    render(<FabDelete />);
    const btn = screen.getByLabelText('btn-delete');
    fireEvent.click(btn);

    expect(mockStartDeletingEvent).toHaveBeenCalledTimes(1);
    expect(mockStartDeletingEvent).toHaveBeenCalledWith();
  });
});
