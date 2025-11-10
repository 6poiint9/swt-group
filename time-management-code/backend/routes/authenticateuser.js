// routes/authenticateuser.js
const express = require('express');
const argon2 = require('argon2');
const User = require('../models/user');
const { validateUsername, validatePassword } = require('../utils/parsing');
const createToken = require('../utils/createToken');

const router = express.Router();

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    const uCheck = validateUsername(username);
    const pCheck = validatePassword(password);
    if (!uCheck.ok || !pCheck.ok) {
      return res.status(401).json({ success: false, message: 'invalid login' });
    }

    // Lookup user in DB
    const user = await User.findByUsername(uCheck.value);
    if (!user) return res.status(401).json({ success: false, message: 'invalid login' });

    // Verify password
    const valid = await argon2.verify(user.password, pCheck.value);
    if (!valid) return res.status(401).json({ success: false, message: 'invalid login' });

    // Success: return token
    const token = createToken(user);
    res.json({ success: true, token, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'invalid login' });
  }
});

module.exports = router;

