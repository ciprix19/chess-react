const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;
const { computePawnMoves, computeBishopMoves, computeKnightMoves, computeKingMoves, computeQueenMoves, computeRookMoves } = require('./legalmoves');
const { getAttackersOfSquare } = require('./attackersquares');

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
    const capturedPiece = chessBoard[to.row][to.col].piece;

    const originalType = pieceToMove.type;

    chessBoard[to.row][to.col].piece = pieceToMove;
    chessBoard[from.row][from.col].piece = null;

    let promotion = false;
    if (
        pieceToMove.type === 'pawn' && (
            (pieceToMove.color === 'white' && to.row === 0) ||
            (pieceToMove.color === 'black' && to.row === 7)
        )
    ) {
        pieceToMove.type = 'queen';
        promotion = true;
    }

    return {
        from,
        to,
        movedPiece: pieceToMove,
        capturedPiece: capturedPiece,
        originalType,
        promotion
    }
}

function undoMove(chessBoard, moveInfo) {
    const { from, to, movedPiece, capturedPiece, originalType, promotion } = moveInfo;

    if (promotion) {
        movedPiece.type = originalType;
    }

    chessBoard[from.row][from.col].piece = movedPiece;
    chessBoard[to.row][to.col].piece = capturedPiece;
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

function isKingInCheck(chessBoard, piecesColor) {
    const kingPosition = getKingPosition(chessBoard, piecesColor);

    const enemyColor = piecesColor === 'white' ? 'black' : 'white';
    const attackers = getAttackersOfSquare(chessBoard, enemyColor, kingPosition);

    return attackers.length > 0;
}

// compute legal moves for a color side
function computeLegalMoves(chessBoard, piecesColor) {
    let legalMoves = [];

    // todo: handle chess rules (check src/db/rules.txt)
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.color === piecesColor) {
                let moves = [];
                switch (chessBoard[row][col].piece.type) {
                    case 'pawn':
                        moves = computePawnMoves(chessBoard, row, col, piecesColor);
                        break;
                    case 'knight':
                        moves = computeKnightMoves(chessBoard, row, col, piecesColor);
                        break;
                    case 'bishop':
                        moves = computeBishopMoves(chessBoard, row, col, piecesColor);
                        break;
                    case 'rook':
                        moves = computeRookMoves(chessBoard, row, col, piecesColor);
                        break;
                    case 'queen':
                        moves = computeQueenMoves(chessBoard, row, col, piecesColor);
                        break;
                    case 'king':
                        moves = computeKingMoves(chessBoard, row, col, piecesColor);
                        break;
                }
                if (moves.length !== 0) {
                    legalMoves.push({
                        from: { row, col },
                        to: moves
                    })
                }
            }
        }
    }

    // handle checks here
    let filteredMoves = [];

    for (const move of legalMoves) {
        const validDestinations = [];
        for (const destination of move.to) {
            const moveInfo = applyMove(chessBoard, move.from, destination);
            const inCheck = isKingInCheck(chessBoard, piecesColor);
            undoMove(chessBoard, moveInfo);
            if (!inCheck) {
                validDestinations.push(destination);
            }
        }

        if (validDestinations.length > 0) {
            filteredMoves.push({
                from: move.from,
                to: validDestinations
            });
        }
    }

    return filteredMoves;
}

module.exports = {
    computeLegalMoves,
    validateMove,
    applyMove,
    undoMove,
    getKingPosition,
    setCapturedPiece,
    isKingInCheck,
}
