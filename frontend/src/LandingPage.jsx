import React from 'react';
 import './LandingPage.css';
 

 const ShieldIcon = () => <span className="icon">🛡️</span>;
 const KeyIcon = () => <span className="icon">🔑</span>;
 const LockIcon = () => <span className="icon">🔒</span>;
 const CheckmarkIcon = () => <span className="icon">✔️</span>;
 const UserIcon = () => <span className="icon">👤</span>;
 const CloudIcon = () => <span className="icon">☁️</span>;
 

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
  <a href="#privacy">Privacy</a>
  <button onClick={onGetStartedClick} className="navbar-cta">Get Started</button>
  </div>
  </nav>
 

  <header className="hero-section">
  <div className="hero-overlay">
  <div className="hero-content">
  <h1>The Ultimate Vault for Your Digital Life.</h1>
  <p className="hero-subtitle">
  Secure your passwords, personal information, and sensitive data with CipherSafe. Built with a zero-trust architecture and end-to-end encryption, your privacy is our top priority. Access your vault securely from any device, knowing your data is protected by military-grade security.
  </p>
  <button onClick={onGetStartedClick} className="hero-cta">Create Your Secure Vault</button>
  </div>
  <div className="hero-image">
  <img src="https://placehold.co/600x400/0a192f/00ffff?text=Secure+Access+Anywhere" alt="Security illustration" />
  </div>
  </div>
  </header>
 

  <section id="features" className="features-section">
  <h2>Key Features of CipherSafe</h2>
  <div className="features-grid">
  <div className="feature-card">
  <LockIcon />
  <h3>Unbreakable Encryption</h3>
  <p>Your data is protected with AES-256 encryption, the same standard used by governments and financial institutions worldwide.</p>
  <CheckmarkIcon className="feature-check-icon" />
  </div>
  <div className="feature-card">
  <KeyIcon />
  <h3>Zero-Knowledge Security</h3>
  <p>Only you hold the key to your data. Your master password is never stored on our servers, ensuring complete privacy.</p>
  <CheckmarkIcon className="feature-check-icon" />
  </div>
  <div className="feature-card">
  <ShieldIcon />
  <h3>Multi-Platform Accessibility</h3>
  <p>Access your secure vault from your desktop, laptop, tablet, or smartphone, seamlessly and securely.</p>
  <CheckmarkIcon className="feature-check-icon" />
  </div>
  <div className="feature-card">
  <UserIcon />
  <h3>Secure Password Generator</h3>
  <p>Create strong, unique passwords for all your online accounts with our built-in password generator.</p>
  <CheckmarkIcon className="feature-check-icon" />
  </div>
  <div className="feature-card">
  <CloudIcon />
  <h3>Encrypted Cloud Backup</h3>
  <p>Securely back up your encrypted data to the cloud, ensuring you never lose access to your important information.</p>
  <CheckmarkIcon className="feature-check-icon" />
  </div>
  <div className="feature-card">
  <ShieldIcon />
  <h3>Two-Factor Authentication</h3>
  <p>Add an extra layer of security to your account with two-factor authentication for enhanced protection.</p>
  <CheckmarkIcon className="feature-check-icon" />
  </div>
  </div>
  </section>
 

  <section id="security" className="security-section">
  <div className="security-overlay">
  <h2>Our Commitment to Security</h2>
  <p>
  At CipherSafe, your security is our paramount concern. We employ a multi-layered security approach to ensure your data remains confidential and protected at all times. Our zero-trust architecture means we never have access to your master password or your encrypted data. All data is encrypted locally on your device before being securely synced to our servers.
  </p>
  <ul>
  <li><strong>End-to-End Encryption:</strong> Your data is encrypted from the moment it leaves your device until it's decrypted on another authorized device.</li>
  <li><strong>AES-256 Bit Encryption:</strong> The industry-standard encryption algorithm ensures your data is virtually impenetrable.</li>
  <li><strong>PBKDF2 Key Derivation:</strong> We use a robust key derivation function to protect your master password against brute-force attacks.</li>
  <li><strong>Regular Security Audits:</strong> Our platform undergoes regular security audits by independent experts to identify and address any potential vulnerabilities.</li>
  </ul>
  </div>
  </section>
 

  <section id="privacy" className="privacy-section">
  <div className="privacy-overlay">
  <h2>Your Privacy Matters</h2>
  <p>
  We believe that privacy is a fundamental right. CipherSafe is designed with privacy at its core. We collect minimal user data, and what we do collect is used solely to provide and improve our services. We will never sell or share your personal information with third parties.
  </p>
  <ul>
  <li><strong>Zero Tracking:</strong> We do not track your browsing activity or the websites you save in your vault.</li>
  <li><strong>Anonymous Usage Data:</strong> We collect anonymized usage statistics to help us improve our app, but this data is never linked to your personal account.</li>
  <li><strong>Transparent Privacy Policy:</strong> Our privacy policy is clear, concise, and easy to understand, outlining exactly how we handle your data.</li>
  </ul>
  </div>
  </section>
 

  <footer className="footer">
  <p>&copy; 2024 CipherSafe. All Rights Reserved. Your security and privacy are our mission.</p>
  </footer>
  </div>
  );
 }
 

 export default LandingPage;
 
