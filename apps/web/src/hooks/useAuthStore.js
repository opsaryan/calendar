import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';
import { checking, cleanEventsOnLogout, clearErrorMessage, login, logout } from '../store';

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const loginUser = ({ token, name, uid }) => {
    localStorage.setItem('token', token);
    // time when token was generated:
    localStorage.setItem('token-init-time', new Date().getTime());

    dispatch(login({ name, uid }));
  };

  const startLogin = async ({ email, password }) => {
    dispatch(checking());

    try {
      const resp = await calendarApi.post('/auth/login', { email, password });
      const data = resp.data;

      loginUser({ token: data.token, name: data.name, uid: data.uid });
      //
    } catch (error) {
      dispatch(logout('Incorrect credentials'));

      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ name, email, password }) => {
    dispatch(checking());

    try {
      const { data } = await calendarApi.post('/auth/new', { name, email, password });

      loginUser({ token: data.token, name: data.name, uid: data.uid });
      //
    } catch (error) {
      // console.log(error)
      const data = error.response?.data;

      if (data?.msg) {
        dispatch(logout(data.msg));
      } else {
        const { msg } = Object.values(data.errors)[0];
        // console.log(Object.values(data.errors));
        dispatch(logout(msg));
      }

      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');

    if (!token) return dispatch(logout());

    try {
      const { data } = await calendarApi.get('/auth/renew');

      loginUser({ token: data.token, name: data.name, uid: data.uid });
      //
    } catch (error) {
      localStorage.clear();
      dispatch(logout());
    }
  };

  const startLogout = () => {
    dispatch(checking());

    localStorage.removeItem('token-init-time');
    localStorage.removeItem('token');

    dispatch(logout());
    dispatch(cleanEventsOnLogout());
  };

  return {
    // Properties
    status,
    user,
    errorMessage,

    // Functions
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout,
  };
};
