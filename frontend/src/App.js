import React, { useState, useEffect, useRef } from 'react';
import FOG from 'vanta/dist/vanta.fog.min';
import * as THREE from 'three';
import './App.css'; // We will create this file next
import Register from './Register';
import Login from './Login';
import Vault from './Vault';

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
        highlightColor: 0x8a3ffc,
        midtoneColor: 0x4a00e0,
        lowlightColor: 0x0d0c0f,
        baseColor: 0x0d0c0f,
        blurFactor: 0.50,
        speed: 1.20
      }));
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [token, vantaEffect]);

  return (
    <div ref={vantaRef} className="App">
      <div className={token ? "vault-container" : "form-container"}>
        {!token && <h1>My Secret Vault</h1>}
        
        {token ? (
          <Vault />
        ) : (
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