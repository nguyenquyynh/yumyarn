import axios from 'axios';
import { auth_logout } from 'reducers/auth';
import { store } from 'store/store';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosInstance = (token = '', contentType = 'application/json') => {
  const axiosInstance = axios.create({
    baseURL: process.env.BASEAPI_URL,
  });

  axiosInstance.interceptors.request.use(
    async config => {
      const token = store.getState().auth.token;
      config.headers = {
        Authorization: `${token}`,
        Accept: 'application/json',
        'Content-Type': contentType,
      };
      return config;
    },
    err => Promise.reject(err),
  );

  axiosInstance.interceptors.response.use(
    res => res.data,
    async err => {
      if (err?.response?.status === 401) {
        // redirect to login page
        store.dispatch(auth_logout());
      }
      return Promise.reject(err?.response?.data)
    },
  );
  return axiosInstance;
};

export default AxiosInstance;
