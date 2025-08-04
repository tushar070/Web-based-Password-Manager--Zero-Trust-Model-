import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';

import AnimatedBackground from './AnimatedBackground.jsx';
import './Vault.css';

const deriveKey = (password, salt) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000
  });
};

function Vault({ onLogout }) {
  // State for forms
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for vault management
  const [masterPassword, setMasterPassword] = useState('');
  const [items, setItems] = useState(null);
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
          setItems([]);
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
      // After adding a new item, we need to re-decrypt to show it.
      // A simpler approach is to mark the vault as unlocked with the new items.
      setIsUnlocked(true); 

      setWebsite('');
      setUsername('');
      setPassword('');

    } catch (error) { 
        toast.error(`Error adding item: ${error.message}`); 
    }
  };

  // ### THIS FUNCTION IS NOW CORRECTLY IMPLEMENTED ###
  const handleDecrypt = async () => {
    if (!masterPassword) {
      toast.info('Please enter your master password to decrypt.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const saltRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/salt`, { headers: { 'x-auth-token': token } });
      if (!saltRes.ok) throw new Error('Could not fetch security salt.');
      const { salt } = await saltRes.json();
      
      const decryptionKey = deriveKey(masterPassword, salt);
      
      if (items.length > 0) {
        const testBytes = CryptoJS.AES.decrypt(items[0].encrypted_data_blob, decryptionKey.toString());
        if (!testBytes.toString(CryptoJS.enc.Utf8)) {
          throw new Error('Wrong password');
        }
      }

      const decrypted = items.map(item => {
        const bytes = CryptoJS.AES.decrypt(item.encrypted_data_blob, decryptionKey.toString());
        const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);
        const decryptedData = JSON.parse(decryptedDataString);
        return { id: item.id, ...decryptedData };
      });
      
      toast.success("Vault Unlocked!");
      setDecryptedItems(decrypted);
      setIsUnlocked(true);
    } catch (error) { 
      toast.error('Decryption failed. Please check your master password.'); 
    }
  };

  const handleCopy = (passwordToCopy) => {
    navigator.clipboard.writeText(passwordToCopy);
    toast.success('Password copied to clipboard!');
  };

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

  const renderContent = () => {
    if (items === null) {
      return <p style={{ color: 'white' }}>Loading your vault...</p>;
    }

    if (items.length === 0) {
      return (
        <form onSubmit={handleAddItem} className="vault-form">
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
        <form onSubmit={handleAddItem} className="vault-form">
          <h3>Add New Item</h3>
          <div><label>Website:</label><input type="text" value={website} onChange={e => setWebsite(e.target.value)} required /></div>
          <div><label>Username/Email:</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} required /></div>
          <div><label>Password:</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <button type="submit">Add to Vault</button>
        </form>
        <hr />
        <div className="vault-controls">
          <h3>Your Saved Items ({filteredItems.length})</h3>
          <input
            type="text"
            placeholder="Search by website..."
            className="search-bar"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="items-list">
          {filteredItems.map(item => (
            <div key={item.id} className="vault-item">
              <div className="item-info">
                <strong>Website:</strong> {item.website}<br />
                <strong>Username:</strong> {item.username}<br />
                <strong>Password:</strong> {'*'.repeat(item.password ? item.password.length : 0)}
              </div>
              <div className="item-actions">
                <button onClick={() => handleCopy(item.password)}>Copy</button>
                <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="vault-container">
      <AnimatedBackground />
      <div className="vault-content">
        <h2>Welcome to Your Secure Vault</h2>
        {renderContent()}
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default Vault;