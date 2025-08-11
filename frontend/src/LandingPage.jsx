
import React, { useEffect } from 'react';
import './LandingPage.css';

// SVG Icons for a professional look
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
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
      <nav className="navbar">
        <div className="navbar-logo">
          <ShieldIcon />
          <span>CipherSafe</span>
        </div>
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
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
        </div>
        <div className="features-grid">
          <div className="feature-card animate-on-scroll">
            <div className="card-image-container">
                <img src="https://images.unsplash.com/photo-1550751827-4138d04d475d?q=80&w=800" alt="Encryption"/>
            </div>
            <div className="card-content">
              <LockIcon />
              <h3>Unbreakable Encryption</h3>
              <p>Using the AES-256 standard, your data is encrypted at the device level. Not even we can access your information.</p>
            </div>
          </div>
          <div className="feature-card animate-on-scroll">
             <div className="card-image-container">
                <img src="https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?q=80&w=800" alt="Privacy Key"/>
            </div>
            <div className="card-content">
              <KeyIcon />
              <h3>Zero-Knowledge Proof</h3>
              <p>Your master password is your private key. It's never stored or transmitted, ensuring only you can decrypt your vault.</p>
            </div>
          </div>
          <div className="feature-card animate-on-scroll">
             <div className="card-image-container">
                <img src="https://images.unsplash.com/photo-1611078489856-98c11b20a3d4?q=80&w=800" alt="Cloud Sync"/>
            </div>
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

      <section id="testimonials" className="testimonials-section">
        <div className="section-header animate-on-scroll">
            <span className="section-tag">Testimonials</span>
            <h2>Trusted by Professionals Worldwide</h2>
        </div>
        <div className="testimonials-grid">
            <div className="testimonial-card animate-on-scroll">
                <p>"CipherSafe has revolutionized how our team handles credentials. It's secure, intuitive, and the peace of mind is priceless."</p>
                <div className="testimonial-author">
                    <img src="https://i.pravatar.cc/100?u=a" alt="Author"/>
                    <div>
                        <h4>Sarah L.</h4>
                        <span>CTO, Tech Solutions Inc.</span>
                    </div>
                </div>
            </div>
            <div className="testimonial-card animate-on-scroll">
                <p>"As a freelance developer, I manage dozens of client passwords. CipherSafe is the only tool I trust. The zero-knowledge architecture is a game-changer."</p>
                <div className="testimonial-author">
                    <img src="https://i.pravatar.cc/100?u=b" alt="Author"/>
                    <div>
                        <h4>David C.</h4>
                        <span>Freelance Developer</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content animate-on-scroll">
            <h2>Ready to Take Control of Your Digital Security?</h2>
            <p>Join thousands of users who trust CipherSafe to protect their most valuable information.</p>
            <button onClick={onGetStartedClick} className="hero-cta">Get Started for Free</button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
            <div className="footer-logo">
                <ShieldIcon />
                <span>CipherSafe</span>
            </div>
            <div className="footer-links">
                <a href="#">About Us</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Contact</a>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2024 CipherSafe. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
