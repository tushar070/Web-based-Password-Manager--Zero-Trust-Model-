import React, { useState, useEffect, useRef } from 'react';
import WAVES from 'vanta/dist/vanta.waves.min'; // <-- Ensures WAVES animation is used
import * as THREE from 'three';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css'; // <-- Crucial for global layout
import LandingPage from './LandingPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import LoginPage from './LoginPage.jsx';
import Vault from './Vault.jsx';

function App() {
  const vantaRef = useRef(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState('landing'); 

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentView('landing');
  };

  const showRegister = () => setCurrentView('register');
  const showLogin = () => setCurrentView('login');

  useEffect(() => {
    let vantaEffect = null;
    if (!token) {
      // --- Uses the WAVES animation ---
      vantaEffect = WAVES({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyrocontrols: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x112240,      // Dark blue base
        shininess: 30.00,
        waveHeight: 15.00,
        waveSpeed: 0.8,
        zoom: 0.85
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [token]);

  const renderCurrentView = () => {
    if (token) {
      return <Vault onLogout={handleLogout} />;
    }
    switch (currentView) {
      case 'register':
        return <RegisterPage onShowLogin={showLogin} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onShowRegister={showRegister} />;
      case 'landing':
      default:
        return <LandingPage onGetStartedClick={showRegister} />;
    }
  };

  return (
    <div className="App">
      <div ref={vantaRef} className="vanta-background"></div>
      <div className="app-content">
        {renderCurrentView()}
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} theme="dark" />
    </div>
  );
}

export default App;
