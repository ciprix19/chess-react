const express = require('express');
const userRouter = express.Router();
const config = require('../config.json');
const { readFile, writeFile, readFileSync, writeFileSync } = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = config.secretKey;

let usersData = JSON.parse(readFileSync(config.usersURL));

let usersIdCount = 0;

if (usersData.users.length !== undefined) {
    usersIdCount = usersData.users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
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

module.exports = userRouter;
