const express = require('express');
const userRouter = express.Router();
const config = require('../config.json');
const { readFile, writeFile, readFileSync, writeFileSync } = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = config.secretKey;

let usersData = JSON.parse(readFileSync(config.usersURL));
let tokensData = JSON.parse(readFileSync(config.refreshTokensURL));

let usersIdCount = 0;

if (usersData.users.length !== undefined) {
    usersIdCount = usersData.users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
}
if (tokensData.refreshTokens.length === undefined) {
    tokensData.refreshTokens = [];
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'Missing access token' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });
        req.user = user;
        next();
    })
}

userRouter.get('/', (req, res) => {
    res.json(usersData);
})

userRouter.post('/signup', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Missing fields' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (usersData.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: usersIdCount++,
        email,
        hashedPassword
    }

    usersData.users.push(newUser);
    writeFileSync(config.usersURL, JSON.stringify(usersData, null, 4));
    res.status(201).json({
        message: 'Sign up successful',
        user: newUser
    })
});

function generateAccessToken(user) {
    return jwt.sign(user, secretKey, { expiresIn: config.expiresIn });
}

userRouter.get('/token', (req, res) => {
    if (req.cookies.token === undefined) return;
    const token = req.cookies.token.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Missing refreshToken' });
    if (!tokensData.refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ messag: 'Refresh token expired' });
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        res.json({
            user: { id: user.id, email: user.email },
            accessToken: accessToken
        });
    })
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = usersData.users.find(u => u.email === email);
    if (user === undefined) return res.status(400).json({ message: 'Email not found' });

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, secretKey);
    tokensData.refreshTokens.push(refreshToken);

    writeFileSync(config.refreshTokensURL, JSON.stringify(tokensData, null, 4));

    res
    .status(200)
    .cookie('token', `Bearer ${refreshToken}`, {
        expires: new Date(Date.now() + 1000 * 600000),
        httpOnly: true
    })
    .json({
        user: { id: user.id, email: user.email },
        accessToken: accessToken
    })
});

userRouter.delete('/logout', async (req, res) => {
    const token = req.cookies.token.split(' ')[1];
    tokensData.refreshTokens = tokensData.refreshTokens.filter(t => t !== token);
    writeFileSync(config.refreshTokensURL, JSON.stringify(tokensData, null, 4));
    res.status(204).clearCookie('token').json({ message: 'Logout successful' });
});

module.exports = userRouter;
