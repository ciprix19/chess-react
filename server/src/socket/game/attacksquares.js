const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;

function computePawnMoves(chessBoard, row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    const oneStep = row + direction;

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

function computeBishopMoves(chessBoard, row, col, color) {
    const moves = [];
    const xDirection = [1,  1, -1, -1];
    const yDirection = [1, -1, -1,  1];

    for (let i = 0; i < 4; i++) {
        let newRow = row + xDirection[i];
        let newCol = col + yDirection[i];
        while(chessBoard[newRow] && chessBoard[newRow][newCol]) {
            if (chessBoard[newRow][newCol].piece !== null) {
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
        )
        moves.push({ row: newRow, col: newCol });
    }

    return moves;
}

function computeRookMoves(chessBoard, row, col, color) {
    const moves = [];
    const xDirection = [0, 1,  0, -1];
    const yDirection = [1, 0, -1,  0];

    for (let i = 0; i < 4; i++) {
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

function computeQueenMoves(chessBoard, row, col, color) {
    const moves = [];
    const xDirection = [0, 1,  0, -1, 1,  1, -1, -1];
    const yDirection = [1, 0, -1,  0, 1, -1, -1,  1];

    for (let i = 0; i < 8; i++) {
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

function computeAttackSquares(chessBoard, piecesColor, kingPosition) {
    const attackSquares = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.color === piecesColor) {
                if (chessBoard[row][col].piece.type === 'pawn') {
                    attackSquares.push(computePawnAttackSquares);
                }
                if (chessBoard[row][col].piece.type === 'bishop') {
                    attackSquares.push(computeBishopAttackSquares);
                }
                if (chessBoard[row][col].piece.type === 'knight') {
                    attackSquares.push(computeKnightAttackSquares);
                }
                if (chessBoard[row][col].piece.type === 'rook') {
                    attackSquares.push(computeRookAttackSquares);
                }
                if (chessBoard[row][col].piece.type === 'queen') {
                    attackSquares.push(computeQueenAttackSquares);
                }
            }
        }
    }

    return attackSquares;
}

module.exports = {
    computeAttackSquares,
}
