const { findMatch, createMatch, removeMatchFromQueue } = require('./matchmaking');
const jwt = require('jsonwebtoken');
const socketAuth = require('./auth')

function initSocket(io) {

    io.use(socketAuth);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('find-match', () => {
            // matchmaking
            console.log(socket.user);
            const match = findMatch(socket, io);
            if (match.players.length === 2) {
                match.sockets.forEach(socketId => {
                    const s = io.sockets.sockets.get(socketId);
                    s.emit('game-ready', {
                        matchId: match.id,
                        players: match.players,
                        you: s.user.email
                    })
                })
                // io.in(match.id).emit('game-ready', {
                //     matchId: match.id,
                //     players: match.players,
                //     you: socket.user.email
                // });
            }
        });

        socket.on('move', (data) => {
            // send move to oponnent
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected', socket.id);
            removeMatchFromQueue(socket);
        })
    });
}

module.exports = initSocket;
