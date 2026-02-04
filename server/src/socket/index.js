const { findMatch, removeMatchFromQueue, getMatchById, getAllMatches } = require('./matchmaking');
const { generateChessBoard, computeLegalMoves, validateMove, applyMove } = require('./game');
const socketAuth = require('./auth')

function initSocket(io) {

    io.use(socketAuth);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        let chessBoard;
        socket.on('find-match', () => {
            // matchmaking
            // console.log(socket.user);
            const match = findMatch(socket, io);
            if (match.players.length === 2) {
                match.chessBoard = generateChessBoard();
                let piecesColor = Math.random() < 0.5 ? 'white' : 'black';
                let firstPlayerColorChosen = false;
                match.sockets.forEach(socketId => {
                    const s = io.sockets.sockets.get(socketId);
                    if (firstPlayerColorChosen === true) {
                        piecesColor === 'white' ? piecesColor = 'black' : piecesColor = 'white';
                    }
                    const legalMoves = computeLegalMoves(match.chessBoard, piecesColor);
                    s.emit('game-ready', {
                        matchId: match.id,
                        players: match.players,
                        you: s.user.email,
                        piecesColor: piecesColor,
                        chessBoard: match.chessBoard,
                        legalMoves: legalMoves,
                        turn: match.turn
                    });
                    firstPlayerColorChosen = true;
                });
            }
        });

        socket.on('client-move', (data) => {
            console.log(data);
            match = getMatchById(data.matchId);
            if (validateMove(match.chessBoard, match.turn, data.piecesColor, data.from, data.to)) {
                match.chessBoard = applyMove(match.chessBoard, data.from, data.to);
                match.turn = match.turn === 'white' ? 'black' : 'white';
                // todo how do i know the color of each player? i need to send the legalMoves after applying the move to both players...
                match.sockets.forEach(socketId => {
                    const s = io.sockets.sockets.get(socketId);
                    s.emit('board-updated', {

                    });
                })
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected', socket.id);
            removeMatchFromQueue(socket);
        })
    });
}

module.exports = initSocket;
