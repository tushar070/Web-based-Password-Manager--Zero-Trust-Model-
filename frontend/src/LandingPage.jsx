// FILE: frontend/src/LandingPage.jsx

import React from 'react';
import './LandingPage.css';

// SVG Icons for a cleaner look
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

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
          <h1 className="hero-title">
            Your Digital Fortress, <br />
            <span className="hero-gradient-text">Secured & Simplified.</span>
          </h1>
          <p className="hero-subtitle">
            CipherSafe is more than a password manager. It's a commitment to your digital privacy, built on a zero-trust architecture with military-grade encryption. Take control of your data, once and for all.
          </p>
          <button onClick={onGetStartedClick} className="hero-cta">Create Your Free Vault</button>
        </div>
        <div className="hero-image">
            <img src="https://placehold.co/600x400/0a192f/6366f1?text=CipherSafe" alt="CipherSafe Security" />
        </div>
      </header>

      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-tag">Why CipherSafe?</span>
          <h2>A Smarter Way to Stay Secure</h2>
          <p>We've packed powerful security features into a simple, intuitive interface.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <LockIcon />
            <h3>Unbreakable Encryption</h3>
            <p>Using the AES-256 standard, your data is encrypted at the device level. Not even we can access your information.</p>
          </div>
          <div className="feature-card">
            <KeyIcon />
            <h3>Zero-Knowledge Proof</h3>
            <p>Your master password is your private key. It's never stored or transmitted, ensuring only you can decrypt your vault.</p>
          </div>
          <div className="feature-card">
            <GlobeIcon />
            <h3>Seamless Syncing</h3>
            <p>Access your encrypted vault across all your devices. Your data stays in sync, securely and automatically.</p>
          </div>
        </div>
      </section>

      <section id="security" className="security-section">
         <div className="section-header">
          <span className="section-tag">Our Architecture</span>
          <h2>Built on a Foundation of Trust</h2>
          <p>Every aspect of CipherSafe is engineered with your security and privacy as the primary focus.</p>
        </div>
        <div className="security-content">
            <div className="security-image">
                <img src="https://placehold.co/500x500/0a192f/6366f1?text=Security+Layers" alt="Security Layers"/>
            </div>
            <ul className="security-list">
                <li>
                    <h4>End-to-End Encryption</h4>
                    <p>Your data is encrypted at all times—at rest on your device, in transit to our servers, and at rest in the cloud.</p>
                </li>
                <li>
                    <h4>PBKDF2 Key Derivation</h4>
                    <p>We use a highly-iterated hashing function to protect your master password from brute-force attacks.</p>
                </li>
                <li>
                    <h4>Regular Security Audits</h4>
                    <p>Our systems are regularly audited by third-party security experts to ensure we meet the highest standards of safety.</p>
                </li>
            </ul>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 CipherSafe. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
