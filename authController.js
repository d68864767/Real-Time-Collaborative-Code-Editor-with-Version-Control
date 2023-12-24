```javascript
// Import required modules
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('./userModel');
const config = require('./config');

// Create a new router
const router = express.Router();

// Load the Passport JWT strategy
require('./config')(passport);

// Register new users
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create a new user
  const newUser = new User({ username, email, password });
  await newUser.save();

  res.json({ message: 'User registered successfully' });
});

// Authenticate users and return JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Check if password is correct
  const isMatch = await user.isValidPassword(password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  // User is valid, create JWT
  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, config.secretOrKey, { expiresIn: '1h' });

  res.json({ message: 'User authenticated successfully', token });
});

// Protect routes with JWT
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'You are authorized' });
});

module.exports = router;
```
