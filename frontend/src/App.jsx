import React, { useState, useEffect, useRef } from 'react';
import FOG from 'vanta/dist/vanta.fog.min';
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
      setVantaEffect(FOG({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyrocontrols: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0x00FFFF, // Cyan
        midtoneColor: 0x0A192F,   // Dark Navy
        lowlightColor: 0x0A192F,  // Dark Navy
        baseColor: 0x0A192F,      // Dark Navy
        blurFactor: 0.80,
        speed: 0.80
      }));
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [token, vantaEffect]);

  return (
    <div ref={vantaRef} className="App">
      <div className={token ? "vault-container" : "form-container"}>
        
        {/* We only show the form card if the user is logged out */}
        {!token && (
          <div className="form-card"> 
            <h1>My Secret Vault</h1>
            <Register />
            <hr />
            <Login />
          </div>
        )}
        
        {token && (
          <Vault />
        )}
        
      </div>
    </div>
  );
}

export default App;