
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import './Vault.css';

// --- Helper Functions & SVG Icons ---
const deriveKey = (password, salt) => CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 1000 });
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

// --- Main Vault Component ---
function Vault({ onLogout }) {
  const [masterPassword, setMasterPassword] = useState('');
  const [items, setItems] = useState(null); // Use null for initial loading state
  const [decryptedItems, setDecryptedItems] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fetch encrypted items when the component loads
  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items`, {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) throw new Error('Failed to fetch vault items');
        const data = await response.json();
        setItems(data);
        // If the vault is empty, there's nothing to decrypt, so we can show the main view.
        if (data.length === 0) {
            setDecryptedItems([]);
        }
      } catch (error) {
        toast.error("Could not load your vault items.");
        setItems([]); // Set to an empty array on error to prevent infinite loading
      }
    };
    fetchItems();
  }, []);

  const handleDecrypt = async () => {
    if (!masterPassword) return toast.info('Please enter your master password.');
    if (!items || items.length === 0) return toast.error("There are no items in your vault to decrypt.");
    
    try {
      const token = localStorage.getItem('token');
      const saltRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/salt`, { headers: { 'x-auth-token': token } });
      if (!saltRes.ok) throw new Error('Could not fetch the security salt from the server.');
      const { salt } = await saltRes.json();
      
      const decryptionKey = deriveKey(masterPassword, salt);
      
      const decrypted = items.map(item => {
        const bytes = CryptoJS.AES.decrypt(item.encrypted_data_blob, decryptionKey.toString());
        const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedDataString) throw new Error("Decryption failed for an item.");
        return { ...JSON.parse(decryptedDataString), id: item.id };
      });
      
      toast.success("Vault Unlocked!");
      setDecryptedItems(decrypted);
    } catch (error) { 
      toast.error('Decryption failed. Please check your master password.'); 
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (items.length === 0 && !masterPassword) {
        return toast.warn("Please create a master password to encrypt your first item.");
    }
    try {
        const token = localStorage.getItem('token');
        const saltRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/salt`, { headers: { 'x-auth-token': token } });
        if (!saltRes.ok) throw new Error('Could not fetch security salt.');
        const { salt } = await saltRes.json();
        
        const keyToUse = items.length > 0 ? deriveKey(masterPassword, salt) : deriveKey(masterPassword, salt);
        const itemToEncrypt = { website, username, password };
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(itemToEncrypt), keyToUse.toString()).toString();

        await fetch(`${import.meta.env.VITE_API_URL}/api/vault/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ encryptedData }),
        });

        toast.success('New item added to vault!');
        const newItemsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items`, { headers: { 'x-auth-token': token } });
        const newItems = await newItemsResponse.json();
        setItems(newItems);
        
        const decrypted = newItems.map(item => {
            const bytes = CryptoJS.AES.decrypt(item.encrypted_data_blob, keyToUse.toString());
            return { ...JSON.parse(bytes.toString(CryptoJS.enc.Utf8)), id: item.id };
        });
        setDecryptedItems(decrypted);

        setWebsite(''); setUsername(''); setPassword('');
    } catch (error) {
        toast.error(`Error adding item: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this item?")) return;
    try {
        const token = localStorage.getItem('token');
        await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token },
        });
        toast.success('Item deleted successfully.');
        setDecryptedItems(prev => prev.filter(item => item.id !== id));
        setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
        toast.error(`Error deleting item: ${error.message}`);
    }
  };
  
  const handleCopy = (text) => { navigator.clipboard.writeText(text); toast.success("Password copied to clipboard!"); };
  const togglePasswordVisibility = (id) => setVisiblePasswords(prev => ({...prev, [id]: !prev[id]}));

  const filteredAndDecryptedItems = decryptedItems.filter(item => 
    item.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER LOGIC ---
  if (items === null) {
      return <div className="loading-state">Loading Secure Vault...</div>;
  }

  if (items.length > 0 && decryptedItems.length === 0) {
      return (
          <div className="unlock-container">
              <h2>Unlock Your Vault</h2>
              <p>Enter your master password to decrypt your items.</p>
              <div className="unlock-form">
                  <input type="password" value={masterPassword} onChange={e => setMasterPassword(e.target.value)} placeholder="Enter Master Password"/>
                  <button onClick={handleDecrypt}>Unlock Vault</button>
              </div>
          </div>
      );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">SECUREVAULT</div>
        <div className="dashboard-actions">
          <button className="theme-toggle"><SunIcon /></button>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="card add-password-card">
          <h2>{items.length === 0 ? "Add Your First Password" : "Add a New Password"}</h2>
          <form onSubmit={handleAddItem}>
            {items.length === 0 && (
                <div className="form-group">
                    <label>Create Master Password</label>
                    <input type="password" value={masterPassword} onChange={e => setMasterPassword(e.target.value)} placeholder="Create a strong master password" required/>
                </div>
            )}
            <div className="form-group">
              <label>Website</label>
              <input type="text" value={website} onChange={e => setWebsite(e.target.value)} placeholder="e.g., Google" required/>
            </div>
            <div className="form-group">
              <label>Username / Email</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g., user@gmail.com" required/>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter a strong password" required/>
            </div>
            <div className="form-actions">
              <button type="button" className="generate-btn">Generate</button>
              <button type="submit" className="add-btn">Add Password</button>
            </div>
          </form>
        </div>

        <div className="card your-passwords-card">
          <div className="your-passwords-header">
            <h2>Your Passwords</h2>
            <input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search passwords..." className="search-input" />
          </div>
          <div className="passwords-list">
            {filteredAndDecryptedItems.length > 0 ? filteredAndDecryptedItems.map(item => (
              <div className="password-item" key={item.id}>
                <div className="item-details">
                  <span className="item-website">{item.website}</span>
                  <span className="item-username">{item.username}</span>
                  <span className="item-password">
                    {visiblePasswords[item.id] ? item.password : '••••••••••••••'}
                  </span>
                </div>
                <div className="item-actions">
                  <button onClick={() => togglePasswordVisibility(item.id)}><EyeIcon /></button>
                  <button onClick={() => handleCopy(item.password)}><CopyIcon /></button>
                  <button onClick={() => handleDelete(item.id)}><DeleteIcon /></button>
                </div>
              </div>
            )) : <p className="empty-vault-message">Your vault is empty. Add a password to get started!</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Vault;