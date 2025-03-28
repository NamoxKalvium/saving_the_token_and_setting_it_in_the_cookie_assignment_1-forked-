const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Encrypt function
const encrypt = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// Decrypt function
const decrypt = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

// Route to encrypt data
app.post('/encrypt', (req, res) => {
    try {
        const { payload } = req.body;
        if (!payload) {
            return res.status(400).json({ error: "Payload is required" });
        }
        const encryptedToken = encrypt(payload);
        res.json({ encryptedToken });
    } catch (error) {
        console.error("Encryption error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to decrypt data
app.post('/decrypt', (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }
        const decoded = decrypt(token);
        res.json({ decoded });
    } catch (error) {
        console.error("Decryption error:", error.message);
        res.status(500).json({ error: "Invalid or Expired Token" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
