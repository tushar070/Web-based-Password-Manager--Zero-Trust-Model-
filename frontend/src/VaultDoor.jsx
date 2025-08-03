import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import VaultDoor from './VaultDoor.jsx'; // Import our new 3D door
import './Vault.css'; // We'll create a dedicated CSS file for the vault

function Vault() {
  const [masterPassword, setMasterPassword] = useState('');
  const [items, setItems] = useState([]);
  const [decryptedItems, setDecryptedItems] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false); // New state to control the vault door

  // Fetch items when the component loads (same as before)
  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/api/vault/items', { headers: { 'x-auth-token': token } });
        const data = await response.json();
        setItems(data);
      } catch (error) { console.error(error); }
    };
    fetchItems();
  }, []);

  const handleDecrypt = () => {
    if (!masterPassword) return alert('Please enter your master password.');
    try {
      // Decrypt just one item to test the password. If it works, decrypt all.
      if (items.length > 0) {
        const testBytes = CryptoJS.AES.decrypt(items[0].encrypted_data_blob, masterPassword);
        if (!testBytes.toString(CryptoJS.enc.Utf8)) {
          throw new Error('Wrong password');
        }
      }
      // If the password is correct, set the state to unlocked
      setIsUnlocked(true);
      // Decrypt all items for display
      const decrypted = items.map(item => {
          const bytes = CryptoJS.AES.decrypt(item.encrypted_data_blob, masterPassword);
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      });
      setDecryptedItems(decrypted);
    } catch (error) {
      alert('Decryption failed. Is the master password correct?');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="vault-interface">
      <VaultDoor isOpen={isUnlocked} />

      {!isUnlocked && (
        <div className="unlock-screen">
          <h2>Enter Master Password to Unlock CipherSafe</h2>
          <input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            placeholder="Your Master Password"
          />
          <button onClick={handleDecrypt}>Unlock</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}

      {isUnlocked && (
        <div className="unlocked-view">
          <h2>Your Secrets</h2>
          <div className="items-grid">
            {decryptedItems.map((item, index) => (
              <div key={index} className="item-card">
                <h3>{item.website}</h3>
                <p>{item.username}</p>
              </div>
            ))}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Vault;