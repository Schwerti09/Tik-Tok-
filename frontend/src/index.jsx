import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#faf5ff',
            color: '#5b21b6',
            border: '1px solid #e9d5ff',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#a855f7', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ec4899', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
