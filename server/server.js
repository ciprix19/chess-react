const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./src/config.json')
const cookieParser = require('cookie-parser');
const usersRouter = require('./src/routes/users');

const port = config.port;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/users', logger, usersRouter);

function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

require('./src/socket')(io);

server.listen(port, () => {
    console.log('SERVER RUNNING');
})

// app.listen(port, () => {
//     console.log('SERVER RUNNING');
// });