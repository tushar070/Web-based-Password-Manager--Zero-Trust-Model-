// In src/LandingPage.js

import React from 'react';
import './LandingPage.css'; // Import the new CSS file

function LandingPage() {
  return (
    <div className="landing-container">
      
      {/* 1. Header/Navigation Bar */}
      <header className="landing-header">
        <div className="logo">MyAIProject</div>
        <nav>
          <span>Home</span>
          <span>Enterprise</span>
          <span>Pricing</span>
        </nav>
        <button className="get-started-btn">Get started</button>
      </header>

      {/* 2. Main Hero Section */}
      <main className="hero-section">
        <h1>Your AI Software Engineer</h1>
        <p>Crush your backlog with your personal AI engineering team.</p>
        <button className="start-building-btn">Start building</button>
      </main>

    </div>
  );
}

export default LandingPage;