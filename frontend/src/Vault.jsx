import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import AnimatedBackground from './AnimatedBackground.jsx';
import './Vault.css';

function Vault() {
  // State for forms
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for vault management
  const [masterPassword, setMasterPassword] = useState('');
  const [items, setItems] = useState([]);
  const [decryptedItems, setDecryptedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false); // NEW: State to track if vault is unlocked

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:3001/api/vault/items', {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) throw new Error('Failed to fetch vault items');
        const data = await response.json();
        setItems(data);
      } catch (error) { console.error('Fetch items error:', error); }
    };
    fetchItems();
  }, []);

  const filteredItems = decryptedItems.filter(item =>
    item.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    if (!isUnlocked || !masterPassword) {
      alert('Please unlock your vault before adding a new item.');
      return;
    }
    try {
      const itemToEncrypt = { website, username, password };
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(itemToEncrypt), masterPassword).toString();
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/vault/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ encryptedData }),
      });
      if (!response.ok) throw new Error('Failed to add item to vault');
      alert('New encrypted item added to vault!');
      window.location.reload();
    } catch (error) { alert(`Error adding item: ${error.message}`); }
  };

  const handleDecrypt = () => {
    if (!masterPassword) {
      alert('Please enter your master password to decrypt.');
      return;
    }
    try {
      if (items.length > 0) {
        const bytes = CryptoJS.AES.decrypt(items[0].encrypted_data_blob, masterPassword);
        if (!bytes.toString(CryptoJS.enc.Utf8)) throw new Error('Wrong password');
      }
      const decrypted = items.map(item => {
        const bytes = CryptoJS.AES.decrypt(item.encrypted_data_blob, masterPassword);
        const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);
        const decryptedData = JSON.parse(decryptedDataString);
        return { id: item.id, ...decryptedData };
      });
      setDecryptedItems(decrypted);
      setIsUnlocked(true); // Set vault to unlocked!
    } catch (error) { alert('Decryption failed. Is the master password correct?'); }
  };

  const handleCopy = (passwordToCopy) => {
    navigator.clipboard.writeText(passwordToCopy);
    alert('Password copied to clipboard!');
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/vault/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Failed to delete item');
      alert('Item deleted successfully.');
      window.location.reload();
    } catch (error) { alert(`Error: ${error.message}`); }
  };

  return (
    <div className="vault-container">
      <AnimatedBackground />
      <h2>Welcome to Your Secure Vault</h2>

      {/* Show unlock form if vault is locked */}
      {!isUnlocked && items.length > 0 && (
        <div className="decrypt-section">
          <input 
            type="password"
            placeholder="Enter Master Password to Unlock"
            value={masterPassword}
            onChange={e => setMasterPassword(e.target.value)}
          />
          <button onClick={handleDecrypt}>Unlock Vault</button>
        </div>
      )}
      
      {/* Show add form and items ONLY if vault is unlocked */}
      {isUnlocked && (
        <>
          <form onSubmit={handleAddItem}>
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
                  <strong>Password:</strong> {'*'.repeat(item.password.length)}
                </div>
                <div className="item-actions">
                  <button onClick={() => handleCopy(item.password)}>Copy</button>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* If the vault is empty, show the add form */}
      {items.length === 0 && (
        <form onSubmit={handleAddItem}>
            <h3>Add Your First Item</h3>
            <div><label>Website:</label><input type="text" value={website} onChange={e => setWebsite(e.target.value)} required /></div>
            <div><label>Username/Email:</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} required /></div>
            <div><label>Password:</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <hr />
            <div><label>Enter Your Master Password (to encrypt):</label><input type="password" value={masterPassword} onChange={e => setMasterPassword(e.target.value)} required /></div>
            <button type="submit">Encrypt & Add to Vault</button>
        </form>
      )}

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default Vault;