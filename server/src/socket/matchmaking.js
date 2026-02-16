let matchId = 0;
let waitingQueue = [];
const matches = new Map();

function createMatch(socket) {
    const match = {
        id: `match-${matchId++}`,
        players: [ { id:socket.user.id, email: socket.user.email } ],
        sockets: [socket.id],
        chessBoard: null,
        //todo: moveHistory,
        playerWhite: null,
        playerBlack: null,
        turn: 'white',
        time: {
            remainingWhite: null,
            remainingBlack: null,
            lastMoveTimeStamp: null
        },
        captures: {
            white: [],
            black: []
        },
        gameStatus: {
            state: 'playing', // | 'check' | 'checkmate' | 'stalemate'
            winner: null, // | User
        }
    }
    waitingQueue.push(match);
    matches.set(match.id, match);

    socket.join(match.id);

    return match;
}

function findMatch(socket, io) {
    const match = waitingQueue.shift();

    if (!match) {
        return createMatch(socket);
    }

    match.players.push({ id: socket.user.id, email: socket.user.email });
    match.sockets.push(socket.id);
    socket.join(match.id);

    // const player1Socket = io.sockets.sockets.get(match.sockets[0]);
    // player1Socket?.join(match.id);

    return match;
}

function getMatchById(matchId) {
    return matches.get(matchId);
}

function getAllMatches() {
    return matches;
}

function removeMatchFromQueue(socket) {
    const index = waitingQueue.findIndex(match => match.sockets.includes(socket.id));

    if (index !== -1) {
        waitingQueue.splice(index, 1);
    }
}

module.exports = {
    createMatch,
    findMatch,
    removeMatchFromQueue,
    getMatchById,
    getAllMatches,
}
