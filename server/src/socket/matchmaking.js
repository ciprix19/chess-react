let matchId = 0;
let waitingQueue = [];
const matches = new Map();

function createMatch(player, socket) {
    const match = {
        id: `match-${matchId++}`,
        players: [player],
        sockets: [socket.id]
    }
    waitingQueue.push(match);
    matches.set(match.id, match);

    socket.join(match.id);

    return match;
}

function findMatch(player, socket, io) {
    const match = waitingQueue.shift();

    if (!match) {
        return createMatch(player, socket);
    }

    match.players.push(player);
    match.sockets.push(socket.id);

    socket.join(match.id);

    const player1Socket = io.sockets.sockets.get(match.sockets[0]);
    player1Socket?.join(match.id);

    return match;
}

function removeMatchFromQueue(socketId) {
    const index = waitingQueue.findIndex(match => match.sockets.includes(socketId));

    if (index !== -1) {
        waitingQueue.slice(index, 1);
    }
}

module.exports = {
    createMatch,
    findMatch,
    removeMatchFromQueue
}
