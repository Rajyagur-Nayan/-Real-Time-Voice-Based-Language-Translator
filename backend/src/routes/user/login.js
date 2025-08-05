const express = require("express");
const { generateToken, verifyToken } = require("../../utils/jwt.js");
const { comparePassword } = require("../../utils/hash.js");
const generateOTP = require("../../controllers/createOTP.controllers.js");
const pool = require("../../connections/DB.connect.js");

require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const DBres = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (DBres.rows.length === 0) {
            return res.status(404).json({ error: "Wrong email" });
        }

        const user = DBres.rows[0];

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Wrong password" });
        }

        const data = { id: user.id, name: user.name};
        const token = generateToken(data);
        res
            .status(200)
            .cookie("login_token", token, {
                httpOnly: false,
                sameSite: "None",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .json({ message: "Login successful", token, user: data });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
