// FILE: frontend/src/RegisterPage.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './AuthPage.css';

function RegisterPage({ onShowLogin }) {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, masterPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      toast.success('Registration successful! Please log in.');
      onShowLogin();
    } catch (error) {
      toast.error(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div className="auth-card">
      <h1>Create Your CipherSafe Account</h1>
      <p className="auth-subtitle">Start your journey to digital security.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
        <input type="password" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} placeholder="Master Password" required />
        <button type="submit" className="auth-button">Create Account</button>
      </form>
      <p className="auth-switch">
        Already have an account? <span onClick={onShowLogin}>Login here</span>
      </p>
    </div>
  );
}

export default RegisterPage;
