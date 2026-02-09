const { findMatch, removeMatchFromQueue, getMatchById, getAllMatches } = require('./matchmaking');
const { generateChessBoard, computeLegalMoves, validateMove, applyMove } = require('./game');
const socketAuth = require('./auth')

function initSocket(io) {

    io.use(socketAuth);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('find-match', () => {
            // matchmaking
            // console.log(socket.user);
            const match = findMatch(socket, io);
            if (match.players.length === 2) {
                match.chessBoard = generateChessBoard();

                const whiteIndex = Math.random() < 0.5 ? 0 : 1;
                const blackIndex = whiteIndex === 0 ? 1 : 0;

                const whiteSocketId = match.sockets[whiteIndex];
                const blackSocketId = match.sockets[blackIndex];

                const whiteSocket = io.sockets.sockets.get(whiteSocketId);
                const blackSocket = io.sockets.sockets.get(blackSocketId);

                match.playerWhitePieces = { id: whiteSocket.user.id, email: whiteSocket.user.email };
                match.playerBlackPieces = { id: blackSocket.user.id, email: blackSocket.user.email };

                whiteSocket.emit('game-ready', {
                    matchId: match.id,
                    players: match.players,
                    playerWhitePieces: match.playerWhitePieces,
                    playerBlackPieces: match.playerBlackPieces,
                    you: { id: whiteSocket.user.id, email: whiteSocket.user.email },
                    chessBoard: match.chessBoard,
                    legalMoves: computeLegalMoves(match.chessBoard, 'white'),
                    piecesColor: 'white',
                    turn: match.turn,
                    gameStatus: match.gameStatus
                });

                blackSocket.emit('game-ready', {
                    matchId: match.id,
                    players: match.players,
                    playerWhitePieces: match.playerWhitePieces,
                    playerBlackPieces: match.playerBlackPieces,
                    you: { id: blackSocket.user.id, email: blackSocket.user.email },
                    chessBoard: match.chessBoard,
                    legalMoves: computeLegalMoves(match.chessBoard, 'black'),
                    movesHistory: match.movesHistory,
                    piecesColor: 'black',
                    turn: match.turn,
                    gameStatus: match.gameStatus
                });
            }
        });

        socket.on('client-move', (data) => {
            console.log(data);
            match = getMatchById(data.matchId);

            if (!match) return;

            let playerColor = null;
            if (socket.user.email === match.playerWhitePieces.email) {
                playerColor = 'white';
            } else if (socket.user.email === match.playerBlackPieces.email) {
                playerColor = 'black';
            } else {
                return;
            }

            if (match.turn !== playerColor) {
                return;
            }

            const isValid = validateMove(match.chessBoard, match.turn, playerColor, data.from, data.to)

            if (!isValid) return;

            match.chessBoard = applyMove(match.chessBoard, data.from, data.to);
            match.turn = match.turn === 'white' ? 'black' : 'white';

            match.sockets.forEach(socketId => {
                const s = io.sockets.sockets.get(socketId);
                if (!s) return;

                const color =
                    s.user.email === match.playerWhitePieces.email
                        ? 'white'
                        : 'black';

                s.emit('board-updated', {
                    matchId: match.id,
                    chessBoard: match.chessBoard,
                    legalMoves: computeLegalMoves(match.chessBoard, color),
                    piecesColor: color,
                    turn: match.turn,
                    gameStatus: match.gameStatus,
                });
            });
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected', socket.id);
            removeMatchFromQueue(socket);
        })
    });
}

module.exports = initSocket;
