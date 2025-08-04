import React, { useState, useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
import './index.css';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Vault from './Vault.jsx';

function App() {
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);
  const token = localStorage.getItem('token');

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
        backgroundColor: 0x0a192f,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 15.00
      }));
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [token, vantaEffect]);

  return (
    <div ref={vantaRef} className="App">
      <div className={token ? "vault-container" : "form-container"}>
        
        {token ? (
          // If a token exists, show the Vault
          <Vault />
        ) : (
          // If no token, show the Register and Login forms in the card
          <div className="form-card"> 
            <h1>CipherSafe</h1>
            <Register />
            <hr />
            <Login />
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;