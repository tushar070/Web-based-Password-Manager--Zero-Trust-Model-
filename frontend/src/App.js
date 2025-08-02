import React from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Secret Vault</h1>
        <Register />
        <hr /> {/* This adds a line to separate the forms */}
        <Login />
      </header>
    </div>
  );
}

export default App;