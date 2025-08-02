// Login a User Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, masterPassword } = req.body;

    // 1. Check if the user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      // We don't say "user not found" for security reasons
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Check if the password is correct
    // We compare the password the user typed with the hashed password in our database
    const isValidPassword = await bcrypt.compare(
      masterPassword, 
      user.rows[0].password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If both checks pass, login is successful!
    // Later, we will add a JWT token here.
    res.status(200).json({ message: "Login successful!" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});