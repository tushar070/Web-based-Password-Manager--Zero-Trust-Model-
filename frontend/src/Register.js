import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, masterPassword }),
      });

      // We get the response body here, regardless of success or failure
      const data = await response.json();

      // NOW we check if the response was successful (e.g. status 200)
      if (!response.ok) {
        // If not okay, we throw an error with the message from the server
        throw new Error(data.error || 'Something went wrong');
      }

      // If we get here, it means the response was OK!
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