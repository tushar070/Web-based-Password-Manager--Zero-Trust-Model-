// FILE: frontend/src/LandingPage.jsx

import React from 'react';
import './LandingPage.css';

const ShieldIcon = () => <span className="icon">🛡️</span>;
const KeyIcon = () => <span className="icon">🔑</span>;
const LockIcon = () => <span className="icon">🔒</span>;

function LandingPage({ onGetStartedClick }) {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="navbar-logo">
          <ShieldIcon />
          <span>CipherSafe</span>
        </div>
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <button onClick={onGetStartedClick} className="navbar-cta">Get Started</button>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1>The Future of Digital Security is Here.</h1>
          <p className="hero-subtitle">
            CipherSafe provides military-grade encryption for your most sensitive data,
            built on a zero-trust model. Secure, private, and powerful.
          </p>
          <button onClick={onGetStartedClick} className="hero-cta">Create Your Secure Vault</button>
        </div>
        <div className="hero-image">
            <img src="cyber-security.png" alt="Security illustration" />
        </div>
      </header>

      <section id="features" className="features-section">
        <h2>Why Choose CipherSafe?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <LockIcon />
            <h3>Zero-Trust Architecture</h3>
            <p>We can't see your data, and we never will. Your master password is the only key, and it never leaves your device.</p>
          </div>
          <div className="feature-card">
            <KeyIcon />
            <h3>PBKDF2 Encryption</h3>
            <p>We use industry-leading key derivation functions to protect your master password from even the most sophisticated attacks.</p>
          </div>
          <div className="feature-card">
            <ShieldIcon />
            <h3>Cross-Platform Access</h3>
            <p>Your secure vault is available on any device, anywhere in the world, without compromising on security.</p>
          </div>
        </div>
      </section>

       <footer className="footer">
            <p>&copy; 2024 CipherSafe. All Rights Reserved. Your security is our mission.</p>
       </footer>
    </div>
  );
}

export default LandingPage;
