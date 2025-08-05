// --- 1. DEPENDENCIES ---
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('./middleware/auth');

// --- 2. SETUP ---
const app = express();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET;
const connectionString = process.env.DATABASE_URL;

if (!jwtSecret || !connectionString) {
  console.error("FATAL ERROR: JWT_SECRET or DATABASE_URL is not defined.");
  process.exit(1);
}

// --- 3. MIDDLEWARE ---
// Allow requests from your Vercel frontend
const corsOptions = {
  origin: 'https://web-based-password-manager-zero-tru.vercel.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- 4. DATABASE CONFIGURATION ---
const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

// --- 5. ROUTES ---

// ## Register a New User ##
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, masterPassword } = req.body;
    if (!email || !masterPassword) {
      return res.status(400).json({ error: "Email and master password are required." });
    }
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User with this email already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(masterPassword, salt);
    const vaultSalt = crypto.randomBytes(16).toString('hex');
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, vault_salt) VALUES ($1, $2, $3) RETURNING id, email",
      [email, passwordHash, vaultSalt]
    );
    res.status(201).json({ message: "User created successfully!", user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// ## Login a User ##
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, masterPassword } = req.body;
    if (!email || !masterPassword) {
      return res.status(400).json({ error: "Email and master password are required." });
    }
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(masterPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error during login." });
  }
});

// ## Get User's Salt ##
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

// ## Vault Item Routes ##
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

app.get('/api/vault/items', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await pool.query("SELECT * FROM vault_items WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    res.json(items.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete('/api/vault/items/:id', auth, async (req, res) => {
    try {
        const itemId = req.params.id;
        const userId = req.user.id;
        await pool.query("DELETE FROM vault_items WHERE id = $1 AND user_id = $2", [itemId, userId]);
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
