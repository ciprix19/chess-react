const jwt = require('jsonwebtoken');
const config = require('../config.json');
const secretKey = config.secretKey;
const { readFile, writeFile, readFileSync, writeFileSync } = require('fs');

async function socketAuth(socket, next) {
    try {
        const token = socket.handshake.auth.token;
        console.log(token);
        const decoded = jwt.verify(token, secretKey);
        let usersData = JSON.parse(readFileSync(config.usersURL));
        const user = await usersData.users.find(u => u.id === decoded.id);
        socket.user = user;
        next();
    } catch(error) {
        console.error('Authentication error:', error);
        next(new Error('Authentication error'));
    }
}

module.exports = socketAuth;