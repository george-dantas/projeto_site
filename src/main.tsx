import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ProjetoProvider } from './context/ProjetoContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProjetoProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <App />
      </BrowserRouter>
    </ProjetoProvider>
  </React.StrictMode>,
);
