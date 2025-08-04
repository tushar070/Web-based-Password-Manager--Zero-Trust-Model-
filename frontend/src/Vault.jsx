// frontend/src/Vault.jsx

import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';

// This component can be removed from here if you prefer, or kept
import AnimatedBackground from './AnimatedBackground.jsx';
import './Vault.css';


const deriveKey = (password, salt) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000
  });
};

// **CHANGE 1: Accept `onLogout` as a prop from App.jsx**
function Vault({ onLogout }) {
  // State for forms
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for vault management
  const [masterPassword, setMasterPassword] = useState('');
  const [items, setItems] = useState(null); // **CHANGE 2: Initialize state to null**
  const [decryptedItems, setDecryptedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items`, {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) throw new Error('Failed to fetch vault items');
        const data = await response.json();
        setItems(data);
      } catch (error) { 
          console.error('Fetch items error:', error);
          toast.error("Could not load your vault items.");
          setItems([]); // Set to empty array on error
      }
    };
    fetchItems();
  }, []);

  const filteredItems = decryptedItems.filter(item =>
    item.website.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddItem = async (event) => {
    event.preventDefault();
    if ((!isUnlocked && items.length > 0) || !masterPassword) {
      toast.warn('Please provide your master password and unlock the vault first.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const saltRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/salt`, { headers: { 'x-auth-token': token } });
      if (!saltRes.ok) throw new Error('Could not fetch security salt.');
      const { salt } = await saltRes.json();
      
      const encryptionKey = deriveKey(masterPassword, salt);
      const itemToEncrypt = { website, username, password };
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(itemToEncrypt), encryptionKey.toString()).toString();
      
      await fetch(`${import.meta.env.VITE_API_URL}/api/vault/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ encryptedData }),
      });
      
      toast.success('New encrypted item added to vault!');
      
      const newItemsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items`, { headers: { 'x-auth-token': token } });
      const newItems = await newItemsResponse.json();
      setItems(newItems);
      setIsUnlocked(true); // If you add an item, the vault is considered unlocked

      setWebsite('');
      setUsername('');
      setPassword('');

    } catch (error) { 
        toast.error(`Error adding item: ${error.message}`); 
    }
  };

  const handleDecrypt = async () => { /* ...no changes needed in this function... */ };
  const handleCopy = (passwordToCopy) => { /* ...no changes needed in this function... */ };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item forever?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      
      toast.success('Item deleted successfully.');
      setDecryptedItems(prevDecrypted => prevDecrypted.filter(item => item.id !== itemId));
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));

    } catch (error) { 
        toast.error(`Error: ${error.message}`); 
    }
  };

  // **CHANGE 3: Improved loading state and conditional rendering**
  const renderContent = () => {
    if (items === null) {
      return <p>Loading your vault...</p>; // Show a loading message
    }

    if (items.length === 0) {
      return (
        <form onSubmit={handleAddItem}>
          <h3>Add Your First Item</h3>
          <div><label>Website:</label><input type="text" value={website} onChange={e => setWebsite(e.target.value)} required /></div>
          <div><label>Username/Email:</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} required /></div>
          <div><label>Password:</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <hr />
          <div><label>Create Your Master Password (to encrypt):</label><input type="password" value={masterPassword} onChange={e => setMasterPassword(e.target.value)} required /></div>
          <button type="submit">Encrypt & Add to Vault</button>
        </form>
      );
    }
    
    if (!isUnlocked) {
      return (
        <div className="decrypt-section">
          <input 
            type="password"
            placeholder="Enter Master Password to Unlock"
            value={masterPassword}
            onChange={e => setMasterPassword(e.target.value)}
          />
          <button onClick={handleDecrypt}>Unlock Vault</button>
        </div>
      );
    }

    // If we get here, it means items.length > 0 AND isUnlocked is true
    return (
      <>
        <form onSubmit={handleAddItem}>
          <h3>Add New Item</h3>
          {/* ...form fields... */}
        </form>
        <hr />
        <div className="vault-controls">
          <h3>Your Saved Items ({filteredItems.length})</h3>
          {/* ...search bar... */}
        </div>
        <div className="items-list">
          {filteredItems.map(item => (
            <div key={item.id} className="vault-item">
              {/* ...item info and buttons... */}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="vault-container">
      <AnimatedBackground />
      <h2>Welcome to Your Secure Vault</h2>
      {renderContent()}
      <button onClick={onLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default Vault;