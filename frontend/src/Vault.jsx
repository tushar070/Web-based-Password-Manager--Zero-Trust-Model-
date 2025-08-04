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

// Accept `onLogout` as a prop from App.jsx
function Vault({ onLogout }) {
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
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ encryptedData }),
      });

      if (!response.ok) throw new Error('Failed to add item to vault');
      
      toast.success('New encrypted item added to vault!');
      
      // Instead of reloading the page, just refetch the items
      const newItemsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items`, { headers: { 'x-auth-token': token } });
      const newItems = await newItemsResponse.json();
      setItems(newItems);

      // Clear the form fields
      setWebsite('');
      setUsername('');
      setPassword('');

    } catch (error) { 
        toast.error(`Error adding item: ${error.message}`); 
    }
  };

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vault/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Failed to delete item');
      
      toast.success('Item deleted successfully.');
      
      // Instead of reloading, filter out the deleted item from state
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      setDecryptedItems(prevDecrypted => prevDecrypted.filter(item => item.id !== itemId));

    } catch (error) { 
        toast.error(`Error: ${error.message}`); 
    }
  };

  return (
    <div className="vault-container">
      <AnimatedBackground />
      <h2>Welcome to Your Secure Vault</h2>
      {/* The rest of your JSX remains the same */}
      {/* ... */}
       {/* Use the passed-in onLogout function */}
      <button onClick={onLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default Vault;