const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;

function isPawnAttackingSquare(row, col, color, square) {
    const direction = color === 'white' ? -1 : 1;
    return (
        (row + direction === square.row && col - 1 === square.col) ||
        (row + direction === square.row && col + 1 === square.col)
    )
}

function isKnightAttackingSquare(row, col, square) {
    const rowDiff = Math.abs(row - square.row);
    const colDiff = Math.abs(col - square.col);

    return (
        (rowDiff === 2 && colDiff === 1) ||
        (rowDiff === 1 && colDiff === 2)
    );
}

function isKingAttackingSquare(row, col, square) {
    return (
        Math.abs(row - square.row) <= 1 &&
        Math.abs(col - square.col) <= 1 &&
        !(row === square.row && col === square.col)
    );
}

function rayAttacksSquare(chessBoard, row, col, xDirection, yDirection, square) {
    for (let i = 0; i < xDirection.length; i++) {
        let newRow = row + xDirection[i];
        let newCol = col + yDirection[i];
        while(chessBoard[newRow] && chessBoard[newRow][newCol]) {
            if (newRow === square.row && newCol === square.col) {
                return true;
            }
            if (chessBoard[newRow][newCol].piece !== null) break;
            newRow += xDirection[i];
            newCol += yDirection[i];
        }
    }
    return false;
}

function isBishopAttackingSquare(chessBoard, row, col, square) {
    const xDirection = [1,  1, -1, -1];
    const yDirection = [1, -1, -1,  1];
    return rayAttacksSquare(chessBoard, row, col, xDirection, yDirection, square);
}

function isRookAttackingSquare(chessBoard, row, col, square) {
    const xDirection = [0, 1,  0, -1];
    const yDirection = [1, 0, -1,  0];
    return rayAttacksSquare(chessBoard, row, col, xDirection, yDirection, square);
}

function isQueenAttackingSquare(chessBoard, row, col, square) {
    const xDirection = [0, 1,  0, -1, 1,  1, -1, -1];
    const yDirection = [1, 0, -1,  0, 1, -1, -1,  1];
    return rayAttacksSquare(chessBoard, row, col, xDirection, yDirection, square);
}

// get the attackers with the color 'piecesColor' that attack the square with the coordinates square.row and square.col
function getAttackersOfSquare(chessBoard, piecesColor, square) {
    const attackerSquares = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.color === piecesColor) {
                if (chessBoard[row][col].piece.type === 'pawn' && isPawnAttackingSquare(row, col, piecesColor, square)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'knight' && isKnightAttackingSquare(row, col, square)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'king' && isKingAttackingSquare(row, col, square)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'bishop' && isBishopAttackingSquare(chessBoard, row, col, square)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'rook' && isRookAttackingSquare(chessBoard, row, col, square)) {
                    attackerSquares.push({ row, col });
                }
                if (chessBoard[row][col].piece.type === 'queen' && isQueenAttackingSquare(chessBoard, row, col, square)) {
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
