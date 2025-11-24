// FIX: Removed the problematic triple-slash directive for React types.
// This directive was causing a type resolution failure, likely by conflicting
// with the project's tsconfig.json, which prevented TypeScript from
// recognizing JSX syntax across the entire application. Removing it allows
// the standard type acquisition via `import React` to function correctly.
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);