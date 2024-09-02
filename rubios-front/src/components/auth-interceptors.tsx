// AuthInterceptor.js

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/auth-slice';
import { history } from '../api/api';  // Asegúrate de importar la variable history desde donde se encuentra en tu aplicación
import ApiRubios from '../api/api';

const AuthInterceptor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interceptResponse = (error: any) => {
      if (error.response && error.response.status === 401) {
        // Redirige al usuario al inicio de sesión
        window.localStorage.clear();
        dispatch(logout());
        history.push('/login');
      }
      if(error.response.status === 500){
        console.log("error 500");
      }
      return Promise.reject(error);
    };

    const requestInterceptor = ApiRubios.interceptors.request.use((config) => {
      const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser') || '{}');
      const token = loggedUser.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log("no token");
      }
      return config;
    });

    const responseInterceptor = ApiRubios.interceptors.response.use(
      (response) => response,
      interceptResponse
    );

    return () => {
      ApiRubios.interceptors.request.eject(requestInterceptor);
      ApiRubios.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]);

  return null;
};

export default AuthInterceptor;
