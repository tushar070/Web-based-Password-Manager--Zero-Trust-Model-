import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './AuthPage.css';
// This file contains the LoginPage component which handles user login functionality.

// The LoginPage component allows users to log in with their email and master password.
// It communicates with the backend API to authenticate the user and retrieve a token.  
function LoginPage({ onLoginSuccess, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, masterPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      onLoginSuccess(data.token);
      toast.success('Login Successful!');
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="auth-card">
      <h1>Welcome Back</h1>
      <p className="auth-subtitle">Login to access your secure vault.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
        <input type="password" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} placeholder="Master Password" required />
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p className="auth-switch">
        Don't have an account? <span onClick={onShowRegister}>Register here</span>
      </p>
    </div>
  );
}

export default LoginPage;