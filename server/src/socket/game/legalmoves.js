const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;
const { getAttackersOfSquare } = require('./attackersquares');

function getPiecesPosition(chessBoard, pieceType, piecesColor) {
    let pieces = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.type === pieceType && chessBoard[row][col].piece.color === piecesColor) {
                pieces.push({ row, col });
            }
        }
    }
    return pieces;
}

function isKingInCheck(chessBoard, piecesColor) {
    const positionsArray = getPiecesPosition(chessBoard, 'king', piecesColor);
    let kingPosition = null;
    if (positionsArray.length === 1) {
        kingPosition = positionsArray[0];
    }
    const enemyColor = piecesColor === 'white' ? 'black' : 'white';
    const attackers = getAttackersOfSquare(chessBoard, enemyColor, kingPosition);
    return attackers.length > 0;
}

function computePawnMoves(chessBoard, row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    const oneStep = row + direction;
    const twoStep = row + direction * 2;

    // forward 1
    if (
        chessBoard[oneStep] &&
        chessBoard[oneStep][col] &&
        chessBoard[oneStep][col].piece === null
    ) {
        moves.push({ row: oneStep, col });

        // forward 2 (first move)
        if (
            chessBoard[twoStep] &&
            chessBoard[twoStep][col] &&
            row === startRow &&
            chessBoard[twoStep][col].piece === null
        ) {
            moves.push({ row: twoStep, col });
        }
    }

    // captures
    for (const dc of [-1, 1]) {
        const c = col + dc;
        if (
            chessBoard[oneStep] &&
            chessBoard[oneStep][c] &&
            chessBoard[oneStep][c].piece &&
            chessBoard[oneStep][c].piece.color !== color
        ) {
            moves.push({ row: oneStep, col: c });
        }
    }
    return moves;
}

function computeKnightMoves(chessBoard, row, col, color) {
    const moves = [];
    const xDirection = [1, 2,  2,  1, -1, -2, -2, -1];
    const yDirection = [2, 1, -1, -2, -2, -1,  1,  2];

    for (let i = 0; i < 8; i++) {
        let newRow = row + xDirection[i];
        let newCol = col + yDirection[i];
        if (
            chessBoard[newRow] &&
            chessBoard[newRow][newCol] &&
            (chessBoard[newRow][newCol].piece === null || chessBoard[newRow][newCol].piece.color !== color)
        ) {
            moves.push({ row: newRow, col: newCol });
        }
    }
    return moves;
}

function computeKingMoves(chessBoard, row, col, color) {
    const moves = [];
    const xDirection = [0, 1,  0, -1, 1,  1, -1, -1];
    const yDirection = [1, 0, -1,  0, 1, -1, -1,  1];

    for (let i = 0; i < 8; i++) {
        let newRow = row + xDirection[i];
        let newCol = col + yDirection[i];
        if (
            chessBoard[newRow] &&
            chessBoard[newRow][newCol] &&
            (chessBoard[newRow][newCol].piece === null || chessBoard[newRow][newCol].piece.color !== color)
        ) {
            moves.push({ row: newRow, col: newCol });
        }
    }

    if (chessBoard[row][col].piece.didMove || isKingInCheck(chessBoard, color)) return moves;

    // king side castle
    if (
        chessBoard[row][7].piece && chessBoard[row][7].piece.type === 'rook' &&
        chessBoard[row][7].piece.color === color && chessBoard[row][7].piece.didMove === false
    ) {
        if (chessBoard[row][5].piece === null && chessBoard[row][6].piece === null) {
            if (
                getAttackersOfSquare(chessBoard, color === 'white' ? 'black' : 'white', { row, col: 5 }).length === 0 &&
                getAttackersOfSquare(chessBoard, color === 'white' ? 'black' : 'white', { row, col: 6 }).length === 0
            ) {
                moves.push({ row, col: 6 });
            }
        }
    }

    // queen side castle
    if (
        chessBoard[row][0].piece && chessBoard[row][0].piece.type === 'rook' &&
        chessBoard[row][7].piece.color === color && chessBoard[row][0].piece.didMove === false
    ) {
        if (chessBoard[row][1].piece === null && chessBoard[row][2].piece === null && chessBoard[row][3].piece === null) {
            if (
                getAttackersOfSquare(chessBoard, color === 'white' ? 'black' : 'white', { row, col: 2 }).length === 0 &&
                getAttackersOfSquare(chessBoard, color === 'white' ? 'black' : 'white', { row, col: 3 }).length === 0
            ) {
                moves.push({ row, col: 2 });
            }
        }
    }

    return moves;
}

function rayAttacks(chessBoard, row, col, color, xDirection, yDirection) {
    let moves = [];
    for (let i = 0; i < xDirection.length; i++) {
        let newRow = row + xDirection[i];
        let newCol = col + yDirection[i];
        while(chessBoard[newRow] && chessBoard[newRow][newCol]) {
            if (chessBoard[newRow][newCol].piece === null) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (chessBoard[newRow][newCol].piece.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            newRow += xDirection[i];
            newCol += yDirection[i];
        }
    }
    return moves;
}

function computeBishopMoves(chessBoard, row, col, color) {
    const xDirection = [1,  1, -1, -1];
    const yDirection = [1, -1, -1,  1];
    const moves = rayAttacks(chessBoard, row, col, color, xDirection, yDirection);
    return moves;
}

function computeRookMoves(chessBoard, row, col, color) {
    const xDirection = [0, 1,  0, -1];
    const yDirection = [1, 0, -1,  0];
    const moves = rayAttacks(chessBoard, row, col, color, xDirection, yDirection);
    return moves;
}

function computeQueenMoves(chessBoard, row, col, color) {
    const xDirection = [0, 1,  0, -1, 1,  1, -1, -1];
    const yDirection = [1, 0, -1,  0, 1, -1, -1,  1];
    const moves = rayAttacks(chessBoard, row, col, color, xDirection, yDirection);
    return moves;
}

module.exports = {
    isKingInCheck,
    getPiecesPosition,
    computePawnMoves,
    computeBishopMoves,
    computeKingMoves,
    computeKnightMoves,
    computeQueenMoves,
    computeRookMoves,
}
