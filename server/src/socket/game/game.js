const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;
const { computePawnMoves, computeBishopMoves, computeKnightMoves, computeKingMoves, computeQueenMoves, computeRookMoves } = require('./legalmoves');
const { computeAttackSquares } = require('./attacksquares');

// function isKingInCheck(chessBoard, color) {
//     const kingPos = findKing(chessBoard, color);
//     const enemyColor = color === 'white' ? 'black' : 'white';

//     const enemyAttacks = computeAttackSquares(boardSize, enemyColor);

//     return enemyAttacks.some(
//         sq => sq.row === king
//     );
// }

function validateMove(chessBoard, turn, piecesColor, from, to) {
    if (turn !== piecesColor) return false;
    if (chessBoard[from.row][from.col].piece.color !== piecesColor) return false;

    if (
        chessBoard[to.row][to.col].piece === null ||
        (chessBoard[to.row][to.col].piece !== null && chessBoard[to.row][to.col].piece.color !== piecesColor)
    ) {
        let legalMoves;
        // validate if the move is legal nevertheless
        if (chessBoard[from.row][from.col].piece.type === 'pawn') {
            legalMoves = computePawnMoves(chessBoard, from.row, from.col, piecesColor);
        }
        if (chessBoard[from.row][from.col].piece.type === 'bishop') {
            legalMoves = computeBishopMoves(chessBoard, from.row, from.col, piecesColor);
        }
        if (chessBoard[from.row][from.col].piece.type === 'knight') {
            legalMoves = computeKnightMoves(chessBoard, from.row, from.col, piecesColor);
        }
        if (chessBoard[from.row][from.col].piece.type === 'rook') {
            legalMoves = computeRookMoves(chessBoard, from.row, from.col, piecesColor);
        }
        if (chessBoard[from.row][from.col].piece.type === 'queen') {
            legalMoves = computeQueenMoves(chessBoard, from.row, from.col, piecesColor);
        }
        if (chessBoard[from.row][from.col].piece.type === 'king') {
            legalMoves = computeKingMoves(chessBoard, from.row, from.col, piecesColor);
        }
        // console.log(legalMoves);
        return legalMoves.some(m => m.row === to.row && m.col === to.col);
    }

    return false;
}

function getCapturedPiece(chessBoard, coordinates) {
    console.log(coordinates);
    if (chessBoard[coordinates.row][coordinates.col].piece !== null) {
        return chessBoard[coordinates.row][coordinates.col].piece;
    }
    return null;
}

function setCapturedPiece(captures, coordinates, playerColor) {
    const capturedPiece = getCapturedPiece(match.chessBoard, coordinates);
    if (capturedPiece !== null) {
        captures[playerColor].push(capturedPiece);
    }
}

function applyMove(chessBoard, from, to) {
    const pieceToMove = chessBoard[from.row][from.col].piece;
    chessBoard[to.row][to.col].piece = pieceToMove;
    chessBoard[from.row][from.col].piece = null;
    return chessBoard;
}

function getKingPosition(chessBoard, piecesColor) {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.type === 'king' && chessBoard[row][col].piece.color === piecesColor) {
                return { row, col };
            }
        }
    }
    return null;
}

// for a given chessBoard and piece color, return { info } if the king with the color 'piecesColor' is in check
function getCheckInfo(chessBoard, currentPlayerColor, enemyColor) {
    const kingPosition = getKingPosition(chessBoard, enemyColor);

    if (kingPosition !== null) {
        //const myAttacks = computeAttackSquares(chessBoard, currentPlayerColor, kingPosition);
        // if (myAttacks.length !== 0) {
        //     for (let el of myAttacks) {
        //         console.log(el);
        //     }
        //     console.log(' are attacking the enemy king at: ' + kingPosition.row + ' ' + kingPosition.col);
        // }
    }
}

module.exports = {
    validateMove,
    applyMove,
    setCapturedPiece,
    getCheckInfo,
}
