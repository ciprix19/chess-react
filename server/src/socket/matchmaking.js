let matchId = 0;
let waitingQueue = [];
const matches = new Map();

function createMatch(socket) {
    const match = {
        id: `match-${matchId++}`,
        players: [socket.user],
        sockets: [socket.id]
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

    match.players.push(socket.user);
    match.sockets.push(socket.id);

    socket.join(match.id);

    const player1Socket = io.sockets.sockets.get(match.sockets[0]);
    player1Socket?.join(match.id);

    return match;
}

function removeMatchFromQueue(socket) {
    const index = waitingQueue.findIndex(match => match.sockets.includes(socket.id));

    if (index !== -1) {
        waitingQueue.slice(index, 1);
    }
}

module.exports = {
    createMatch,
    findMatch,
    removeMatchFromQueue
}
