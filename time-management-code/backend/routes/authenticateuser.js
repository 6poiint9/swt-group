// routes/authenticateuser.js
const express = require('express');
const argon2 = require('argon2');
const User = require('../models/user');
const authservice = require('../utils/validatePwd')
const parsInput = require('../middleware/parsing');
const createToken = require('../utils/createToken');

const router = express.Router();

// POST /api/login
router.post('/login',parsInput,  async (req, res) => {
  try {
    const { username, password } = req.body;
    
    await authservice.validatePassword(username, password);

    // Success: return token
    const token = createToken.generateToken(user);
    res.json({ success: true, token, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'invalid login' });
  }
});

module.exports = router;

