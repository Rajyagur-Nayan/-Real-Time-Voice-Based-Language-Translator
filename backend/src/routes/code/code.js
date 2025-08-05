const express = require('express');
const axios = require('axios');
const pool = require('../../connections/DB.connect'); // PostgreSQL client
const router = express.Router();
const isLoggedIn = require('../../middelwear/login.js')

router.get('/', async (req, res) => {
    try {
        const languages = [
            { "en": "English" },
            { "ar": "Arabic" },
            { "az": "Azerbaijani" },
            { "zh": "Chinese" },
            { "cs": "Czech" },
            { "da": "Danish" },
            { "nl": "Dutch" },
            { "fi": "Finnish" },
            { "fr": "French" },
            { "de": "German" },
            { "el": "Greek" },
            { "hi": "Hindi" },
            { "hu": "Hungarian" },
            { "id": "Indonesian" },
            { "ga": "Irish" },
            { "it": "Italian" },
            { "ja": "Japanese" },
            { "ko": "Korean" },
            { "fa": "Persian" },
            { "pl": "Polish" },
            { "pt": "Portuguese" },
            { "ru": "Russian" },
            { "es": "Spanish" },
            { "sv": "Swedish" },
            { "tr": "Turkish" },
            { "uk": "Ukrainian" },
            { "ur": "Urdu" },
            { "vi": "Vietnamese" }
        ];

        res.status(200).json({ languages })
    } catch (error) {
        console.error('code error:', error.message);
        res.status(500).json({ error: 'Internal server error during code' });
    }
})

module.exports = router;