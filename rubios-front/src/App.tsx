import React from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './components/layout/layout';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import RouterNavigation from './routes-navigation/routes';
import AuthInterceptor from './components/auth-interceptors';



function App() {

  return (
    <>
      <AuthInterceptor />
      <Router>
        <Layout />
        <RouterNavigation />
      </Router>
    </>
  );
}

export default App;
