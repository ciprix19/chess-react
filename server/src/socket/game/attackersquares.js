const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;

function isPawnAttackingKing(row, col, color, position) {
    const direction = color === 'white' ? -1 : 1;
    return (
        (row + direction === position.row && col - 1 === position.col) ||
        (row + direction === position.row && col + 1 === position.col)
    )
}

function isKnightAttackingKing(row, col, position) {
    const rowDiff = Math.abs(row - position.row);
    const colDiff = Math.abs(col - position.col);

    return (
        (rowDiff === 2 && colDiff === 1) ||
        (rowDiff === 1 && colDiff === 2)
    );
}

function isKingAttackingSquare(row, col, position) {
    return (
        Math.abs(row - position.row) <= 1 &&
        Math.abs(col - position.col) <= 1 &&
        !(row === position.row && col === position.col)
    );
}

function rayAttacksKing(chessBoard, row, col, xDirection, yDirection, position) {
    for (let i = 0; i < xDirection.length; i++) {
        let newRow = row + xDirection[i];
        let newCol = col + yDirection[i];
        while(chessBoard[newRow] && chessBoard[newRow][newCol]) {
            if (newRow === position.row && newCol === position.col) {
                return true;
            }
            if (chessBoard[newRow][newCol].piece !== null) break;
            newRow += xDirection[i];
            newCol += yDirection[i];
        }
    }
    return false;
}

function isBishopAttackingKing(chessBoard, row, col, position) {
    const xDirection = [1,  1, -1, -1];
    const yDirection = [1, -1, -1,  1];
    return rayAttacksKing(chessBoard, row, col, xDirection, yDirection, position);
}

function isRookAttackingKing(chessBoard, row, col, position) {
    const xDirection = [0, 1,  0, -1];
    const yDirection = [1, 0, -1,  0];
    return rayAttacksKing(chessBoard, row, col, xDirection, yDirection, position);
}

function isQueenAttackingKing(chessBoard, row, col, position) {
    const xDirection = [0, 1,  0, -1, 1,  1, -1, -1];
    const yDirection = [1, 0, -1,  0, 1, -1, -1,  1];
    return rayAttacksKing(chessBoard, row, col, xDirection, yDirection, position);
}

function getAttackersOfSquare(chessBoard, piecesColor, position) {
    const attackerSquares = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.color === piecesColor) {
                if (chessBoard[row][col].piece.type === 'pawn' && isPawnAttackingKing(row, col, piecesColor, position)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'knight' && isKnightAttackingKing(row, col, position)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'king' && isKingAttackingSquare(row, col, position)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'bishop' && isBishopAttackingKing(chessBoard, row, col, position)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'rook' && isRookAttackingKing(chessBoard, row, col, position)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'queen' && isQueenAttackingKing(chessBoard, row, col, position)) {
                    attackerSquares.push({ row, col });
                }
            }
        }
    }

    return attackerSquares;
}

module.exports = {
    getAttackersOfSquare,
}
