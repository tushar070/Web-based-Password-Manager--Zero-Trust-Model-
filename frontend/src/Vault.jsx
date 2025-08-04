import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import AnimatedBackground from './AnimatedBackground.jsx';
import './Vault.css';

/**
 * Derives a strong encryption key from a password and a salt using PBKDF2.
 * This is much more secure than using the password directly.
 * @param {string} password The user's master password.df
 * @param {string} salt A unique, random string for the user.
 * @returns {Object} The derived key.
 */
const deriveKey = (password, salt) => {

  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256-bit key
    iterations: 1000    // A standard number of iterations
  });
};

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
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Fetch all encrypted items from the server when the component loads
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
  
  // Handles adding a new item. Now uses the derived key for encryption.
  const handleAddItem = async (event) => {
    event.preventDefault();
    // Allow adding if the vault is empty OR if it's unlocked.
    // Also ensures a master password has been entered.
    if ((!isUnlocked && items.length > 0) || !masterPassword) {
      alert('Please provide your master password and unlock the vault before adding a new item.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      // Fetch the user's unique salt from the backend
      const saltRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/salt`, { headers: { 'x-auth-token': token } });
      if (!saltRes.ok) throw new Error('Could not fetch security salt.');
      const { salt } = await saltRes.json();
      
      // Create the secure key
      const encryptionKey = deriveKey(masterPassword, salt);
      
      const itemToEncrypt = { website, username, password };
      // Encrypt the data with the DERIVED KEY, not the raw password
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(itemToEncrypt), encryptionKey.toString()).toString();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ encryptedData }),
      });

      if (!response.ok) throw new Error('Failed to add item to vault');
      alert('New encrypted item added to vault!');
      window.location.reload();
    } catch (error) { alert(`Error adding item: ${error.message}`); }
  };

  // Handles decrypting the vault. Now uses the derived key.
  const handleDecrypt = async () => {
    if (!masterPassword) {
      alert('Please enter your master password to decrypt.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      // Fetch the user's unique salt from the backend
      const saltRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/salt`, { headers: { 'x-auth-token': token } });
      if (!saltRes.ok) throw new Error('Could not fetch security salt.');
      const { salt } = await saltRes.json();
      
      // Create the secure key to try and unlock the vault
      const decryptionKey = deriveKey(masterPassword, salt);
      
      // Test the key on the first item to see if it's correct before proceeding
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

      setDecryptedItems(decrypted);
      setIsUnlocked(true); // Success! The vault is now unlocked.
    } catch (error) { 
      alert('Decryption failed. Please check your master password.'); 
    }
  };

  const handleCopy = (passwordToCopy) => {
    navigator.clipboard.writeText(passwordToCopy);
    alert('Password copied to clipboard!');
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item forever?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Failed to delete item');
      alert('Item deleted successfully.');
      window.location.reload();
    } catch (error) { alert(`Error: ${error.message}`); }
  };

  // --- JSX Rendering ---
  return (
    <div className="vault-container">
      <AnimatedBackground />
      <h2>Welcome to Your Secure Vault</h2>

      {/* Show unlock form if vault is locked AND has items */}
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

      {/* If the vault is empty, show a dedicated form to add the first item */}
      {items.length === 0 && (
        <form onSubmit={handleAddItem}>
            <h3>Add Your First Item</h3>
            <div><label>Website:</label><input type="text" value={website} onChange={e => setWebsite(e.target.value)} required /></div>
            <div><label>Username/Email:</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} required /></div>
            <div><label>Password:</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <hr />
            <div><label>Create Your Master Password (to encrypt):</label><input type="password" value={masterPassword} onChange={e => setMasterPassword(e.target.value)} required /></div>
            <button type="submit">Encrypt & Add to Vault</button>
        </form>
      )}

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default Vault;