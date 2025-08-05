const express = require('express');
const axios = require('axios');
const pool = require('../../connections/DB.connect'); // PostgreSQL client
const router = express.Router();
const isLoggedIn = require('../../middelwear/login.js')

router.post('/', isLoggedIn, async (req, res) => {
    const { sourceLanguage, targetLanguage, text } = req.body;
    const userId = req.user.id;

    if (!sourceLanguage || !targetLanguage || !text) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!userId) {
        return res.status(400).json({ error: 'pleas login first' });
    }

    try {
        const lingvaURL = `https://lingva.ml/api/v1/${sourceLanguage}/${targetLanguage}/${encodeURIComponent(text)}`;
        const response = await axios.get(lingvaURL);

        const translatedText = response.data?.translation;

        if (!translatedText) {
            return res.status(502).json({ error: 'Translation failed.' });
        }

        // Save to DB
        await pool.query(
            `INSERT INTO translations 
             (user_id, source_language, target_language, source_text, translated_text) 
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, sourceLanguage, targetLanguage, text, translatedText]
        );

        res.status(200).json({ translatedText });
    } catch (error) {
        console.error('Translation error:', error.message);
        res.status(500).json({ error: 'Internal server error during translation' });
    }
});


module.exports = router;
