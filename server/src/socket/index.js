function initSocket(io) {
    const {
        findMatch,
        createMatch,
        removeMatchFromQueue
    } = require('./matchmaking');

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('find-match', (data) => {
            // matchmaking
            console.log(data);
            const match = findMatch(data.user, socket, io);
            if (match.players.length === 2) {
                io.in(match.id).emit('game-ready', {
                    matchId: match.id,
                    players: match.players
                });
            }
        });

        socket.on('move', (data) => {
            // send move to oponnent
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected', socket.id);
        })
    });
}

module.exports = initSocket;
