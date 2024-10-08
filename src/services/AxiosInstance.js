import axios from 'axios';
import { useSelector } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosInstance = (token = '', contentType = 'application/json') => {
    const axiosInstance = axios.create({
        baseURL: 'https://yumyarn.web.phqmarket.online/'
    });

    axiosInstance.interceptors.request.use( 
        async (config) => {
            config.headers = {
                'Authorization': `${token}`,
                'Accept': 'application/json',
                'Content-Type': contentType
            }
            return config;
        },
        err => Promise.reject(err)
    );

    axiosInstance.interceptors.response.use(
        res => res.data,
        err => Promise.reject(err)
    );
    return axiosInstance;
};

export default AxiosInstance;