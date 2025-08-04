import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import AnimatedBackground from './AnimatedBackground.jsx';
import './Vault.css';

// This function is our "Magic Key-Making Machine"
const deriveKey = (password, salt) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256-bit key
    iterations: 1000 // Number of times to stretch and twist
  });
};

function Vault() {
  const [masterPassword, setMasterPassword] = useState('');
  const [items, setItems] = useState([]);
  const [decryptedItems, setDecryptedItems] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  // ... other form state variables

  useEffect(() => { /* ... This function remains the same ... */ }, []);

  const handleAddItem = async (event) => {
    event.preventDefault();
    if (!isUnlocked || !masterPassword) return alert('Please unlock the vault first.');
    
    try {
      const token = localStorage.getItem('token');
      const saltRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/salt`, { headers: { 'x-auth-token': token } });
      const { salt } = await saltRes.json();

      const encryptionKey = deriveKey(masterPassword, salt); // Use the machine to make the key
      
      const itemToEncrypt = { website, username, password };
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(itemToEncrypt), encryptionKey.toString()).toString();

      await fetch(`${import.meta.env.VITE_API_URL}/api/vault/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ encryptedData }),
      });
      alert('New encrypted item added!');
      window.location.reload();
    } catch (error) { alert(`Error adding item: ${error.message}`); }
  };

  const handleDecrypt = async () => {
    if (!masterPassword) return alert('Please enter your master password.');
    try {
      const token = localStorage.getItem('token');
      const saltRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/salt`, { headers: { 'x-auth-token': token } });
      if (!saltRes.ok) throw new Error('Could not fetch salt.');
      const { salt } = await saltRes.json();
      
      const decryptionKey = deriveKey(masterPassword, salt); // Use the machine to make the key

      const decrypted = items.map(item => {
        const bytes = CryptoJS.AES.decrypt(item.encrypted_data_blob, decryptionKey.toString());
        const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedDataString);
      });
      
      setDecryptedItems(decrypted);
      setIsUnlocked(true);
    } catch (error) { alert('Decryption failed. Is the master password correct?'); }
  };

  // ... other functions like handleLogout, handleCopy, handleDelete, etc. remain the same ...
  
  return (
    // ... your JSX remains the same ...
  );
}

export default Vault;