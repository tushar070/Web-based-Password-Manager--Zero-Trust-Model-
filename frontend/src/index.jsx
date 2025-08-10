// This file is part of a React application that serves as the frontend for a web-based password manager.
// It includes the main application component, which sets up the Vanta.js background effect and conditionally renders the vault or authentication forms based on user login status. 
// The application uses React hooks for state management and side effects, and it imports necessary styles and components for user registration, login, and vault functionality.
// The Vanta.js effect adds a visually appealing background to the application, enhancing the user experience.
// The application also handles user authentication by checking for a token in local storage and rendering the appropriate components accordingly.  
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
