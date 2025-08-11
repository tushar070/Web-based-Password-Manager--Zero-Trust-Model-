
import React, { useEffect } from 'react';
import './LandingPage.css';

// SVG Icons for a professional look
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const LockIcon = () => <svg xmlns="http://www.w.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

function LandingPage({ onGetStartedClick }) {
    
  // Effect to handle scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(elem => {
      observer.observe(elem);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-background-overlay"></div>
      <nav className="navbar">
        <div className="navbar-logo">
          <ShieldIcon />
          <span>CipherSafe</span>
        </div>
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#security">Security</a>
          <button onClick={onGetStartedClick} className="navbar-cta">Get Started</button>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content animate-on-scroll">
          <h1 className="hero-title">
            Your Digital Fortress, <br />
            <span className="hero-gradient-text">Secured & Simplified.</span>
          </h1>
          <p className="hero-subtitle">
            CipherSafe is more than a password manager. It's a commitment to your digital privacy, built on a zero-trust architecture with military-grade encryption. Take control of your data, once and for all.
          </p>
          <button onClick={onGetStartedClick} className="hero-cta">Create Your Free Vault</button>
        </div>
      </header>

      <section id="features" className="features-section">
        <div className="section-header animate-on-scroll">
          <span className="section-tag">Why CipherSafe?</span>
          <h2>A Smarter Way to Stay Secure</h2>
          <p>We've packed powerful security features into a simple, intuitive interface.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card animate-on-scroll" style={{'--bg-image': 'url(https://cryptocalc.com.au/_nuxt/img/encryption-logo.706c297.png)'}}>
            <div className="card-content">
              <LockIcon />
              <h3>Unbreakable Encryption</h3>
              <p>Using the AES-256 standard, your data is encrypted at the device level. Not even we can access your information.</p>
            </div>
          </div>
          <div className="feature-card animate-on-scroll" style={{'--bg-image': 'url(https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600)'}}>
            <div className="card-content">
              <KeyIcon />
              <h3>Zero-Knowledge Proof</h3>
              <p>Your master password is your private key. It's never stored or transmitted, ensuring only you can decrypt your vault.</p>
            </div>
          </div>
          <div className="feature-card animate-on-scroll" style={{'--bg-image': 'url(https://images.unsplash.com/photo-1611078489856-98c11b20a3d4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600)'}}>
            <div className="card-content">
              <GlobeIcon />
              <h3>Seamless Syncing</h3>
              <p>Access your encrypted vault across all your devices. Your data stays in sync, securely and automatically.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-header animate-on-scroll">
          <span className="section-tag">How It Works</span>
          <h2>Your Security in Three Steps</h2>
        </div>
        <div className="steps-container">
            <div className="step animate-on-scroll">
                <div className="step-number">1</div>
                <div className="step-content">
                    <h3>Create Your Vault</h3>
                    <p>Choose a strong, unique master password. This is the only key to your vault and is never stored by us.</p>
                </div>
            </div>
            <div className="step-connector"></div>
            <div className="step animate-on-scroll">
                <div className="step-number">2</div>
                <div className="step-content">
                    <h3>Encrypt Locally</h3>
                    <p>When you add a password, it's immediately encrypted on your device using AES-256 before being sent anywhere.</p>
                </div>
            </div>
            <div className="step-connector"></div>
            <div className="step animate-on-scroll">
                <div className="step-number">3</div>
                <div className="step-content">
                    <h3>Sync Securely</h3>
                    <p>Your encrypted data is synced across your devices. Only you can decrypt it with your master password.</p>
                </div>
            </div>
        </div>
      </section>

      <section id="security" className="security-slider-section">
        <div className="section-header animate-on-scroll">
            <span className="section-tag">Trusted Technologies</span>
            <h2>Built on a Foundation of Trust</h2>
        </div>
        <div className="slider">
            <div className="slide-track">
                {/* Add logos of technologies or partners */}
                <div className="slide"><img src="https://kinsta.com/wp-content/uploads/2022/04/postgres-logo.png" alt="PostgreSQL"/></div>
                <div className="slide"><img src="https://pluspng.com/img-png/react-logo-png-react-js-logo-history-design-history-and-evolution-5500x3094.png" alt="React"/></div>
                <div className="slide"><img src="https://images.seeklogo.com/logo-png/26/1/node-js-logo-png_seeklogo-269242.png" alt="Node.js"/></div>
                <div className="slide"><img src="https://www.watchregister.com/img/aes256.png" alt="AES-256"/></div>
                <div className="slide"><img src="https://pythonfix.com/pkg/p/pbkdf2/pbkdf2-banner.webp" alt="PBKDF2"/></div>
                <div className="slide"><img src="https://thf.bing.com/th/id/OIP.ypz_d6GL7n2nXfQnbw_ARAHaFj?o=7&cb=thfc1rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Vercel"/></div>
                {/* Duplicate for infinite loop effect */}
                            <div className="slide"><img src="https://kinsta.com/wp-content/uploads/2022/04/postgres-logo.png" alt="PostgreSQL"/></div>
                <div className="slide"><img src="https://pluspng.com/img-png/react-logo-png-react-js-logo-history-design-history-and-evolution-5500x3094.png" alt="React"/></div>
                <div className="slide"><img src="https://images.seeklogo.com/logo-png/26/1/node-js-logo-png_seeklogo-269242.png" alt="Node.js"/></div>
                <div className="slide"><img src="https://www.watchregister.com/img/aes256.png" alt="AES-256"/></div>
                <div className="slide"><img src="https://pythonfix.com/pkg/p/pbkdf2/pbkdf2-banner.webp" alt="PBKDF2"/></div>
                <div className="slide"><img src="https://thf.bing.com/th/id/OIP.ypz_d6GL7n2nXfQnbw_ARAHaFj?o=7&cb=thfc1rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Vercel"/></div>
            </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 CipherSafe. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
