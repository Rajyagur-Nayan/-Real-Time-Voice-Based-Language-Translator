const express = require('express');
const nodemailer = require("nodemailer");
require('dotenv').config();
const pool = require('../../connections/DB.connect.js');
const { generateToken, verifyToken } = require('../../utils/jwt.js');
const { hashPassword, comparePassword } = require('../../utils/hash.js');

const router = express.Router();

// routes
router.post('/', async (req, res) => {
    const { name, email, password: rawPassword } = req.body;

    if (!name || !email || !rawPassword) {
        return res.status(400).json({ error: 'All fields are required: name, email, password' });
    }

    try {
        const hashedPassword = await hashPassword(rawPassword);

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Insert new user
        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [name, email, hashedPassword]
        );

        const user = result.rows[0];
        res.status(201).json({ message: 'User registered successfully', user });

    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
