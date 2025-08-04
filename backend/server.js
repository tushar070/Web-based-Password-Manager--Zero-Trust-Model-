// --- 1. DEPENDENCIES ---
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // We need this to create the salt
const auth = require('./middleware/auth');

// --- 2. SETUP ---
const app = express();
const port = 3001;
const jwtSecret = process.env.JWT_SECRET;

// --- 3. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 4. DATABASE CONFIGURATION ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- 5. ROUTES ---

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
    
    // Create the unique "magic dust" (vault salt) for the new user
    const vaultSalt = crypto.randomBytes(16).toString('hex');

    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, vault_salt) VALUES ($1, $2, $3) RETURNING id, email",
      [email, passwordHash, vaultSalt] // Save the vault salt
    );
    res.status(201).json({ message: "User created successfully!", user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login a User Route (No changes here)
app.post('/api/auth/login', async (req, res) => {
  // ... This function remains the same ...
});

// NEW ROUTE: Get the user's salt
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


// Add/Get Vault Items Routes (No changes here)
app.post('/api/vault/add', auth, async (req, res) => {
  // ... This function remains the same ...
});
app.get('/api/vault/items', auth, async (req, res) => {
  // ... This function remains the same ...
});
app.delete('/api/vault/items/:id', auth, async (req, res) => {
    // ... This function remains the same ...
});
app.put('/api/vault/items/:id', auth, async (req, res) => {
    // ... This function remains the same ...
});

// --- 6. START SERVER ---
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});