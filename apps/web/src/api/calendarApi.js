import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL } = getEnvVariables();

// console.log(getEnvVariables());

const calendarApi = axios.create({
  baseURL: VITE_API_URL,
});

// Todo: configure interceptors
calendarApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    'x-token': localStorage.getItem('token'),
  };

  return config;
});

export default calendarApi;
