import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { AppRouter } from '../../src/router/AppRouter';

jest.mock('../../src/hooks/useAuthStore');

// mock a component
// to avoid mock many hooks or others
jest.mock('../../src/calendar/pages/CalendarPage', () => {
  return {
    CalendarPage: () => <h1>Calendar Page</h1>,
  };
});

describe('Tests on AppRouter component', () => {
  const mockCheckAuthToken = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test('Should render loader when auth status is checking', () => {
    useAuthStore.mockReturnValue({ status: 'checking', checkAuthToken: mockCheckAuthToken });

    render(<AppRouter />);
    const loaderDiv = screen.getByLabelText('loader-div');

    expect(loaderDiv.classList.contains('loader')).toBe(true);
    expect(loaderDiv.classList).toContain('loader');
    expect(mockCheckAuthToken).toHaveBeenCalledTimes(1);
    expect(mockCheckAuthToken).toHaveBeenCalledWith();
  });

  test('Should render login screen if not-authenticated', () => {
    useAuthStore.mockReturnValue({
      status: 'not-authenticated',
      checkAuthToken: mockCheckAuthToken,
    });

    const { container } = render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.findByText('Login')).toBeTruthy();
    expect(screen.findByText('Register')).toBeTruthy();
    expect(container).toMatchSnapshot();
    expect(screen.getAllByRole('button').length).toBe(2);
  });

  test('Should render / principal page if authenticated', () => {
    useAuthStore.mockReturnValue({ status: 'authenticated', checkAuthToken: mockCheckAuthToken });

    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Calendar Page')).toBeTruthy();
  });
});
