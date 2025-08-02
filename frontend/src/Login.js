import React, { useState } from 'react';

function Login() {
  // State for email and password
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  // This function runs when the user clicks the "Login" button
  const handleSubmit = (event) => {
    event.preventDefault();

    // We will eventually send this to the backend to verify
    console.log('Logging in with:', { email, masterPassword });

    alert(`Attempting login for: ${email}`);
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