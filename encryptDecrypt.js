const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 
const IV_LENGTH = 16; 

// Encrypt JWT Token
const encrypt = (payload) => {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // Generate a random IV (Initialization Vector)
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};

// Decrypt JWT Token
const decrypt = (token) => {
    const parts = token.split(':');
    if (parts.length !== 2) throw new Error('Invalid token format');

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return jwt.verify(decrypted, SECRET_KEY);
};

module.exports = { encrypt, decrypt };
