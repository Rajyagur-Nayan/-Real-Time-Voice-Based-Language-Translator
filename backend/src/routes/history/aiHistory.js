const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middelwear/login.js')
const pool = require('../../connections/DB.connect.js')



router.get('/gethistory', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await pool.query(
      'SELECT * FROM translations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch translation history' });
  }
});

router.get('/clearhistory',isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query('DELETE FROM translations WHERE user_id = $1', [userId]);

    res.status(200).json({ message: 'Translation history cleared' });
  } catch (err) {
    console.error('Error clearing history:', err);
    res.status(500).json({ error: 'Failed to clear translation history' });
  }
});

module.exports = router;