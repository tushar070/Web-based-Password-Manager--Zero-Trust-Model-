import React, { useState, useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all your components
import './index.css';
import LandingPage from './LandingPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import LoginPage from './LoginPage.jsx';
import Vault from './Vault.jsx';

function App() {
  const vantaRef = useRef(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // This state controls which view is active
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

  // Functions to switch between views
  const showRegister = () => setCurrentView('register');
  const showLogin = () => setCurrentView('login');

  // This effect manages the Vanta.js background
  useEffect(() => {
    let vantaEffect = null;
    
    // Only show the animation if the user is logged out
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

    // If logged out, decide between landing, register, and login forms
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
