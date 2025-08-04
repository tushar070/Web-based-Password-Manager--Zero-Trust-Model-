// --- 1. DEPENDENCIES ---
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth'); // Import the auth middleware

// --- 2. SETUP ---
const app = express();
const port = 3001;
//const jwtSecret = 'your_super_secret_kefy_that_should_be_long_and_random';
const jwtSecret = process.env.JWT_SECRET;
// --- 3. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 4. DATABASE CONFIGURATION ---
// const pool = new Pool({
//   user: 'gitpod',
//   host: 'localhost',
//   database: 'password_manager_db',
//   password: 'gitpod',
//   port: 5432,
// });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
// --- 5. ROUTES ---

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Power is ON!' });
});

// Register a New User Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, masterPassword } = req.body;
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User with this email already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(masterPassword, salt);
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );
    res.status(201).json({ message: "User created successfully!", user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login a User Route
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

// Add a new item to the vault (Protected Route)
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

// Get all vault items for a user (Protected Route)
app.get('/api/vault/items', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await pool.query(
      "SELECT * FROM vault_items WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(items.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// --- 6. START SERVER ---
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});