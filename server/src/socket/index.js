const { findMatch, removeMatchFromQueue, getMatchById, getAllMatches } = require('./matchmaking');
const { computeLegalMoves } = require('./game/legalmoves');
const { generateChessBoard } = require('./game/generateChessBoard');
const { validateMove, applyMove, setCapturedPiece, getCheckInfo } = require('./game/game');
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
            // for (let i = 0; i < 20; i++) {
            //     match.captures['white'].push({ type: 'pawn', color: 'black', value: 1 });
            // }
            match.chessBoard = applyMove(match.chessBoard, data.from, data.to);
            match.turn = match.turn === 'white' ? 'black' : 'white';

            // check info for the chessboard and match.turn would be the enemy color
            // i say go find out if my move checks your king
            // i want to find out:
            /*
                1. am i in check?
                2. if yes, i want to know who attacks the king (the squares that attack and the square which is attacked (king))
            */
            // const checkInfo = getCheckInfo(match.chessBoard, playerColor, match.turn);

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
