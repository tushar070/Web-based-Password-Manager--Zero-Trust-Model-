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
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
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
        backgroundColor: 0x0a192f
      }));
    } else if (token && vantaEffect) {
      vantaEffect.destroy();
      setVantaEffect(null);
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [token]);

  return (
    <div className="App">
      {/* This ref is now on a dedicated background element */}
      <div ref={vantaRef} className="vanta-background"></div>

      {/* This div wraps all your actual page content */}
      <div className="app-content">
        <div className={token ? "" : "form-container"}>
          {token ? (
            <Vault onLogout={handleLogout} />
          ) : (
            <div className="form-card">
              <h1>CipherSafe</h1>
              <Register />
              <hr />
              <Login onLoginSuccess={handleLoginSuccess} />
            </div>
          )}
        </div>
      </div>

      <ToastContainer
          position="bottom-right"
          autoClose={5000}
          theme="dark"
        />
    </div>
  );
}

export default App;