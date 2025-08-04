import React, { useState, useEffect, useRef } from 'react';
import FOG from 'vanta/dist/vanta.fog.min';
import NET from 'vanta/dist/vanta.net.min'; // Import NET
import * as THREE from 'three';
import './index.css';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Vault from './Vault.jsx';
import AnimatedBackground from './AnimatedBackground.jsx'; // Ensure this import exists

function App() {
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token && !vantaEffect) {
      setVantaEffect(NET({ // Initialize NET for landing page
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
        pointsAtOnce: 3,
        maxDistance: 15.00,
        showDots: false
      }));
    } else if (token && !vantaEffect) {
      setVantaEffect(FOG({ // You can keep FOG or switch to nothing here if AnimatedBackground handles it
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: false,
        touchControls: false,
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
        {!token && (
          <div className="form-card">
            <h1>CipherSafe</h1> {/* Updated title */}
            <h2>Create Your Account</h2> {/* More engaging heading */}
            <Register />
            <hr />
            <h2>Login to Your Account</h2> {/* More engaging heading */}
            <Login />
            <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#a8b2d1' }}>Securely manage your passwords.</p> {/* Added tagline */}
          </div>
        )}
        {token && (
          <Vault /> {/* Vault component will handle its own background */}
        )}
      </div>
    </div>
  );
}

export default App;