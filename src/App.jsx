import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import { Authprovider } from './store/auth.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Waves from 'node-waves';
import 'node-waves/dist/waves.css';

const App = () => {
  return <Authprovider><BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>{renderRoutes(routes)} <ToastContainer/></BrowserRouter></Authprovider>;
};
Waves.init();
export default App;
