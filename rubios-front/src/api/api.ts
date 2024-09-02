import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const ApiRubios: AxiosInstance = axios.create({
   //baseURL: 'http://localhost:5000/',
   baseURL: 'https://rubios-app-a75ede08d049.herokuapp.com/',
    //baseURL: 'https://finan-app-c3c8a15cb3fe.herokuapp.com/'
});


export default ApiRubios;
