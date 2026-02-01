const { findMatch, removeMatchFromQueue } = require('./matchmaking');
const { generateChessBoard } = require('./game');
const jwt = require('jsonwebtoken');
const socketAuth = require('./auth')

function initSocket(io) {

    io.use(socketAuth);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        let chessBoard;
        socket.on('find-match', () => {
            // matchmaking
            console.log(socket.user);
            const match = findMatch(socket, io);
            if (match.players.length === 2) {
                chessBoard = generateChessBoard();
                let piecesColor = Math.random() < 0.5 ? 'white' : 'black';
                let firstPlayerColorChosen = false;
                match.sockets.forEach(socketId => {
                    const s = io.sockets.sockets.get(socketId);
                    if (firstPlayerColorChosen === true) {
                        piecesColor === 'white' ? piecesColor = 'black' : piecesColor = 'white';
                    }
                    s.emit('game-ready', {
                        matchId: match.id,
                        players: match.players,
                        you: s.user.email,
                        piecesColor: piecesColor,
                        chessBoard: chessBoard,
                        turn: 'white'
                    });
                    firstPlayerColorChosen = true;
                });
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
