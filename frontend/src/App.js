import React from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import Vault from './Vault'; // 1. Import the new Vault component

function App() {
  // 2. Check if a token exists in local storage
  const token = localStorage.getItem('token');

  return (
    <div className="App">
      <div className="form-container">
        <h1>My Secret Vault</h1>
        
        {/* 3. This is the conditional logic */}
        {token ? (
          // If a token exists, show the Vault
          <Vault />
        ) : (
          // If no token, show the Register and Login forms
          <>
            <Register />
            <hr />
            <Login />
          </>
        )}

      </div>
    </div>
  );
}

export default App;