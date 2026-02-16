const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;
const {
    isKingInCheck,
    computePawnMoves,
    computeBishopMoves,
    computeKnightMoves,
    computeKingMoves,
    computeQueenMoves,
    computeRookMoves
} = require('./legalmoves');

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
    const originalDidMove = pieceToMove.didMove;

    chessBoard[to.row][to.col].piece = pieceToMove;
    chessBoard[from.row][from.col].piece = null;

    pieceToMove.didMove = true;

    let promotion = false;
    let castled = false;
    let rookInfo = null;

    if (
        pieceToMove.type === 'pawn' && (
            (pieceToMove.color === 'white' && to.row === 0) ||
            (pieceToMove.color === 'black' && to.row === 7)
        )
    ) {
        pieceToMove.type = 'queen';
        promotion = true;
    }
    if (pieceToMove.type === 'king' && Math.abs(to.col - from.col) === 2) {
        castled = true;
        if (to.col === 6) {
            const rook = chessBoard[from.row][7].piece;
            rookInfo = {
                rook,
                originalDidMove: rook.didMove,
                fromCol: 7,
                toCol: 5
            };
            chessBoard[from.row][5].piece = rook;
            chessBoard[from.row][7].piece = null;
            rook.didMove = true;
        }
        if (to.col === 2) {
            const rook = chessBoard[from.row][0].piece;
            rookInfo = {
                rook,
                originalDidMove: rook.didMove,
                fromCol: 0,
                toCol: 3
            };
            chessBoard[from.row][3].piece = rook;
            chessBoard[from.row][0].piece = null;
            rook.didMove = true;
        }
    }

    return {
        from,
        to,
        movedPiece: pieceToMove,
        capturedPiece: capturedPiece,
        originalType,
        originalDidMove,
        promotion,
        castled,
        rookInfo,
    }
}

function undoMove(chessBoard, moveInfo) {
    const { from, to, movedPiece, capturedPiece, originalType, originalDidMove, promotion, castled, rookInfo } = moveInfo;

    if (promotion) {
        movedPiece.type = originalType;
    }

    if (castled && rookInfo) {
        chessBoard[from.row][rookInfo.fromCol].piece = rookInfo.rook;
        chessBoard[from.row][rookInfo.toCol].piece = null;
        rookInfo.rook.didMove = rookInfo.originalDidMove;
    }

    movedPiece.didMove = originalDidMove;

    chessBoard[from.row][from.col].piece = movedPiece;
    chessBoard[to.row][to.col].piece = capturedPiece;
}

// compute legal moves for a color side
function computeLegalMoves(chessBoard, piecesColor) {
    let legalMoves = [];

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
    setCapturedPiece,
}
