import React, { useState, useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all your components
import './index.css';
import LandingPage from './LandingPage.jsx'; // <-- Import the new component
import Register from './Register.jsx';
import Login from './Login.jsx';
import Vault from './Vault.jsx';

function App() {
  const vantaRef = useRef(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // This new state controls which view is active
  const [currentView, setCurrentView] = useState('landing'); 

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentView('landing'); // Go back to the landing page on logout
  };

  // This function is passed to the LandingPage
  const showAuthForms = () => {
    setCurrentView('auth');
  };

  // This effect manages the Vanta.js background
  useEffect(() => {
    let vantaEffect = null;
    
    // Only show the animation if the user is logged out and on the landing/auth page
    if (!token) {
      vantaEffect = NET({
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
      });
    }

    // Cleanup function to destroy the animation when it's no longer needed
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [token]); // The effect depends on the login state

  // This function determines what to render
  const renderCurrentView = () => {
    // If user is logged in, always show the vault
    if (token) {
      return <Vault onLogout={handleLogout} />;
    }

    // If logged out, decide between landing and auth forms
    switch (currentView) {
      case 'auth':
        return (
          <div className="form-card">
            <h1>CipherSafe</h1>
            <Register />
            <hr />
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        );
      case 'landing':
      default:
        return <LandingPage onGetStartedClick={showAuthForms} />;
    }
  };

  return (
    <div className="App">
      {/* The Vanta background div is now separate */}
      <div ref={vantaRef} className="vanta-background"></div>

      <div className="app-content">
        {renderCurrentView()}
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