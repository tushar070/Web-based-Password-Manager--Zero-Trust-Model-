import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
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
      alert('Registration successful!');
      setEmail('');
      setMasterPassword('');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Create Your Account</h2>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;