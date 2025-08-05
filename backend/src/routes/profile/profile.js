const express = require('express');
const router = express.Router();
const pool = require('../../connections/DB.connect.js');
const isLoggedIn = require('../../middelwear/login');

// GET user profile
router.get('/me', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user profile
router.put('/update', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
      [name, email, userId]
    );

    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
