import React, { useState, useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Vault from './Vault.jsx';

function App() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  
  // Manage the token in state, initializing from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));

  // This function will be passed to the Login component
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // This function will be passed to the Vault component
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    // The useEffect below will handle recreating the Vanta effect
  };

  useEffect(() => {
    // Only initialize Vanta if there is NO token and it hasn't been created yet
    if (!token && !vantaEffect) {
      setVantaEffect(NET({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyrocontrols: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x00ffff,
        backgroundColor: 0x0a192f,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 15.00
      }));
    }

    // Cleanup effect
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null); // Reset the state
      }
    };
  }, [token]); // This effect now depends on the token state

  return (
    <div ref={vantaRef} className="App">
      <div className={token ? "" : "form-container"}>
        {token ? (
          // If a token exists, show the Vault and pass the logout handler
          <Vault onLogout={handleLogout} />
        ) : (
          // If no token, show the Register and Login forms
          <div className="form-card">
            <h1>CipherSafe</h1>
            <Register />
            <hr />
            {/* Pass the login handler to the Login component */}
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        )}
      </div>
      {/* ToastContainer for notifications across the app */}
      <ToastContainer
          position="bottom-right"
          autoClose={5000}
          theme="dark"
        />
    </div>
  );
}

export default App;