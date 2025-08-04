// frontend/src/Login.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';

// **CHANGE: Accept onLoginSuccess as a prop**
function Login({ onLoginSuccess }) {
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
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // **CHANGE: Call the function from App.jsx instead of managing state here**
      onLoginSuccess(data.token);
      toast.success('Login successful!');

    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label>Master Password:</label>
          <input 
            type="password" 
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;