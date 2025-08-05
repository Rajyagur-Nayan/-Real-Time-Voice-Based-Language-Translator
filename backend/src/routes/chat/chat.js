// routes/chat.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'userMessage is required' });
    }

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                // model: 'mistralai/mistral-7b-instruct', // you can change this model
                model: 'meta-llama/llama-3.2-3b-instruct:free', // you can change this model
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant for a real-time language translator platform. Guide users step-by-step: First, sign up or log in. Then choose source and target languages. Type or speak to input text. Show translated result instantly. Allow PDF or text export of translation history. Keep answers short—max 4 short lines per reply. Be clear, fast, and friendly."
                    }
                    ,
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OpenRouterApiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000', // change to your frontend domain
                    'X-Title': 'learn-ai-chatbot',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error calling OpenRouter:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get response from OpenRouter' });
    }
});

module.exports = router;
