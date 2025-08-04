import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications

// Accept onLoginSuccess as a prop from App.jsx
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, masterPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Instead of managing the token here, pass it up to the App component
      onLoginSuccess(data.token);
      
      // The success toast is optional, as the UI will change automatically
      toast.success('Login successful!');

    } catch (error) {
      console.error('Login failed:', error);
      // Use toast for error messages instead of alert ok
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