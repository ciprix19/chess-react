const { findMatch, removeMatchFromQueue, getMatchById, getAllMatches } = require('./matchmaking');
const { generateChessBoard } = require('./game/generateChessBoard');
const { validateMove, applyMove, setCapturedPiece, computeLegalMoves, isKingInCheck } = require('./game/game');
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

                match.playerWhite = { id: whiteSocket.user.id, email: whiteSocket.user.email };
                match.playerBlack = { id: blackSocket.user.id, email: blackSocket.user.email };

                whiteSocket.emit('game-ready', {
                    matchId: match.id,
                    players: match.players,
                    playerWhite: match.playerWhite,
                    playerBlack: match.playerBlack,
                    you: { id: whiteSocket.user.id, email: whiteSocket.user.email },
                    chessBoard: match.chessBoard,
                    legalMoves: computeLegalMoves(match.chessBoard, 'white'),
                    captures: match.captures,
                    piecesColor: 'white',
                    turn: match.turn,
                    gameStatus: match.gameStatus
                });

                blackSocket.emit('game-ready', {
                    matchId: match.id,
                    players: match.players,
                    playerWhite: match.playerWhite,
                    playerBlack: match.playerBlack,
                    you: { id: blackSocket.user.id, email: blackSocket.user.email },
                    chessBoard: match.chessBoard,
                    legalMoves: computeLegalMoves(match.chessBoard, 'black'),
                    captures: match.captures,
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
            if (socket.user.email === match.playerWhite.email) {
                playerColor = 'white';
            } else if (socket.user.email === match.playerBlack.email) {
                playerColor = 'black';
            } else {
                return;
            }

            if (match.turn !== playerColor) {
                return;
            }

            const isValid = validateMove(match.chessBoard, match.turn, playerColor, data.from, data.to);
            if (!isValid) return;

            setCapturedPiece(match.captures, data.to, playerColor);
            applyMove(match.chessBoard, data.from, data.to);
            match.turn = match.turn === 'white' ? 'black' : 'white';

            const enemyLegalMoves = computeLegalMoves(match.chessBoard, match.turn);
            const isKingChecked = isKingInCheck(match.chessBoard, match.turn);
            // checking if i need to update gameStatus
            // handle the game over situations here
            if (enemyLegalMoves.length === 0) {
                // game is over
                if (isKingInCheck(match.chessBoard, match.turn)) {
                    match.gameStatus = {
                        state: 'checkmate',
                        winner: socket.user
                    }
                } else { // king not checked then stalemate
                    match.gameStatus = {
                        state: 'stalemate'
                    }
                }
            } else if (isKingChecked) { // and handle the check situations here... needed for playing check sound on frontend for current implementation
                match.gameStatus = {
                    state: 'check'
                }
            } else {
                match.gameStatus = {
                    state: 'playing'
                }
            }
            match.sockets.forEach(socketId => {
                const s = io.sockets.sockets.get(socketId);
                if (!s) return;

                const color =
                    s.user.email === match.playerWhite.email
                        ? 'white'
                        : 'black';

                s.emit('board-updated', {
                    matchId: match.id,
                    chessBoard: match.chessBoard,
                    legalMoves: computeLegalMoves(match.chessBoard, color),
                    captures: match.captures,
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
