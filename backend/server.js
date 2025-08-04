// --- 1. DEPENDENCIES ---
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // ADDED: For generating the vault salt
const auth = require('./middleware/auth');

// --- 2. SETUP ---
const app = express();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET;
const connectionString = process.env.DATABASE_URL;

// --- 3. MIDDLEWARE ---
const corsOptions = {
  origin: 'https://web-based-password-manager-zero-tru.vercel.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json()); // You only need this once

// --- 4. DATABASE CONFIGURATION ---
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// --- 5. ROUTES ---

// Health Check Route (Preserved from your original code)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Power is ON!' });
});

// Register a New User Route (UPDATED)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, masterPassword } = req.body;
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User with this email already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(masterPassword, salt);
    
    // ADDED: Create the unique vault salt for the new user
    const vaultSalt = crypto.randomBytes(16).toString('hex');

    // MODIFIED: Added vault_salt to the INSERT statement
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, vault_salt) VALUES ($1, $2, $3) RETURNING id, email",
      [email, passwordHash, vaultSalt] // Pass the new salt to the query
    );
    res.status(201).json({ message: "User created successfully!", user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login a User Route (No changes needed here, it remains the same)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, masterPassword } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(masterPassword, user.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const payload = { user: { id: user.rows[0].id } };
    jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// NEW ROUTE: Get the user's salt (needed for decryption on the frontend)
app.get('/api/auth/salt', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const saltResult = await pool.query("SELECT vault_salt FROM users WHERE id = $1", [userId]);
    if (saltResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ salt: saltResult.rows[0].vault_salt });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new item to the vault (No changes needed here)
app.post('/api/vault/add', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { encryptedData } = req.body;
    const newItem = await pool.query(
      "INSERT INTO vault_items (user_id, encrypted_data_blob) VALUES ($1, $2) RETURNING id",
      [userId, encryptedData]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all vault items for a user (No changes needed here)
app.get('/api/vault/items', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await pool.query(
      "SELECT * FROM vault_items WHERE user_id = $1 ORDER BY created_at DESC", // Kept your sorting
      [userId]
    );
    res.json(items.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a vault item
app.delete('/api/vault/items/:id', auth, async (req, res) => {
    try {
        const itemId = req.params.id;
        const userId = req.user.id;
        const deleteRes = await pool.query(
            "DELETE FROM vault_items WHERE id = $1 AND user_id = $2",
            [itemId, userId]
        );
        if (deleteRes.rowCount === 0) {
            return res.status(404).json({ error: "Item not found or permission denied." });
        }
        res.json({ message: "Item deleted successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error deleting item." });
    }
});


// --- 6. START SERVER ---
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});