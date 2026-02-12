const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;

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

//todo maybe i need a isSquareAttacked function? and use this also for the computeAttackSquares?
function computeLegalMovesInCheck(chessBoard, enemyAttacks, myKingPosition, myColor) {

}

module.exports = {
    computePawnMoves,
    computeBishopMoves,
    computeKingMoves,
    computeKnightMoves,
    computeQueenMoves,
    computeRookMoves,
}
