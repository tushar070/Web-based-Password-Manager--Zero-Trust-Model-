import React, { useState } from 'react';
import CryptoJS from 'crypto-js'; // Import the crypto library

function Vault() {
  // State for the form fields
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [masterPassword, setMasterPassword] = useState(''); // New state for the master password

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleAddItem = async (event) => {
    event.preventDefault();

    try {
      // 1. Combine the data to be encrypted
      const itemToEncrypt = { website, username, password };

      // 2. Encrypt the data using the master password as the key
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(itemToEncrypt),
        masterPassword // The user's secret key
      ).toString();

      // 3. Send ONLY the encrypted data to the backend
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/vault/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ encryptedData }), // Send the scrambled data
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      alert('New encrypted item added to vault!');
      // Clear all form fields
      setWebsite('');
      setUsername('');
      setPassword('');
      setMasterPassword('');

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Welcome to Your Secure Vault</h2>
      <form onSubmit={handleAddItem} style={{ marginTop: '30px' }}>
        <h3>Add New Item</h3>
        <div>
          <label>Website:</label>
          <input type="text" value={website} onChange={e => setWebsite(e.target.value)} required />
        </div>
        <div>
          <label>Username/Email:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <hr />
        <div>
          <label>Enter Your Master Password (to encrypt):</label>
          <input type="password" value={masterPassword} onChange={e => setMasterPassword(e.target.value)} required />
        </div>
        <button type="submit">Encrypt & Add to Vault</button>
      </form>
      <button onClick={handleLogout} style={{ marginTop: '50px', backgroundColor: '#555' }}>Logout</button>
    </div>
  );
}

export default Vault;