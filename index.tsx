import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SessionContextProvider } from '@/src/components/SessionContextProvider'; // Corrected import path

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SessionContextProvider>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);