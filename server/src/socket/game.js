const boardSize = 8;

function flipBoard(chessBoard) {
    const chessBoardAux = chessBoard;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (i + j < boardSize - 1) {
                const newi = boardSize - 1 - i;
                const newj = boardSize - 1 - j;
                if (i > newi || (i === newi && j >= newj)) continue;
                [chessBoardAux[i][j], chessBoardAux[newi][newj]] = [chessBoardAux[newi][newj], chessBoardAux[i][j]];
            }
        }
    }
    return chessBoardAux;
}

function generateChessBoard() {
    let boardMatrix = [];
    squareIdCounter = 0;
    for (let row = 0; row < boardSize; row++) {
        let tempArr = [];
        for (let col = 0; col < boardSize; col++) {
            let Square = {
                squareId: squareIdCounter++,
                row: row,
                col: col,
                piece: null
            };
            tempArr.push(Square);
        }
        boardMatrix.push(tempArr);
    }
    for (let col = 0; col < boardSize; col++) {
        boardMatrix[1][col].piece = { type: 'pawn', color: 'black' };
        boardMatrix[6][col].piece = { type: 'pawn', color: 'white' };
    }
    boardMatrix[0][0].piece = { type: 'rook', color: 'black' };
    boardMatrix[0][7].piece = { type: 'rook', color: 'black' };
    boardMatrix[7][0].piece = { type: 'rook', color: 'white' };
    boardMatrix[7][7].piece = { type: 'rook', color: 'white' };
    boardMatrix[0][1].piece = { type: 'knight', color: 'black' };
    boardMatrix[0][6].piece = { type: 'knight', color: 'black' };
    boardMatrix[7][1].piece = { type: 'knight', color: 'white' };
    boardMatrix[7][6].piece = { type: 'knight', color: 'white' };
    boardMatrix[0][2].piece = { type: 'bishop', color: 'black' };
    boardMatrix[0][5].piece = { type: 'bishop', color: 'black' };
    boardMatrix[7][2].piece = { type: 'bishop', color: 'white' };
    boardMatrix[7][5].piece = { type: 'bishop', color: 'white' };
    boardMatrix[0][4].piece = { type: 'king', color: 'black' };
    boardMatrix[7][4].piece = { type: 'king', color: 'white' };
    boardMatrix[0][3].piece = { type: 'queen', color: 'black' };
    boardMatrix[7][3].piece = { type: 'queen', color: 'white' };

    let pieceId = 0;
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (boardMatrix[row][col].piece !== null) {
                boardMatrix[row][col].piece.id = pieceId;
                pieceId++;
            }
        }
    }

    return boardMatrix;
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

function computeBishopMoves(chessBoard, row, col, color) {
    const moves = [];
    const direction = [];

    return moves;
}

function computeKnightMoves(chessBoard, row, col, color) {
    const moves = [];
    const direction = [];

    return moves;
}

function computeRookMoves(chessBoard, row, col, color) {
    const moves = [];

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
            chessBoard[newRow][newCol].piece === null
        )
        moves.push({ row: newRow, col: newCol });
    }
    return moves;
}

function computeQueenMoves(chessBoard, row, col, color) {
    const moves = [];

    return moves;
}

// compute legal moves for a color side
function computeLegalMoves(chessBoard, piecesColor) {
    let legalMoves = [];

    //legal moves for pawn
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.type === 'pawn' && chessBoard[row][col].piece.color === piecesColor) {
                legalMoves.push({
                    from: { row: row, col: col},
                    to: computePawnMoves(chessBoard, row, col, piecesColor)
                });
            }
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.type === 'bishop' && chessBoard[row][col].piece.color === piecesColor) {
                legalMoves.push({
                    from: { row: row, col: col},
                    to: computeBishopMoves(chessBoard, row, col, piecesColor)
                });
            }
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.type === 'knight' && chessBoard[row][col].piece.color === piecesColor) {
                legalMoves.push({
                    from: { row: row, col: col},
                    to: computeKnightMoves(chessBoard, row, col, piecesColor)
                });
            }
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.type === 'rook' && chessBoard[row][col].piece.color === piecesColor) {
                legalMoves.push({
                    from: { row: row, col: col},
                    to: computeRookMoves(chessBoard, row, col, piecesColor)
                });
            }
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.type === 'king' && chessBoard[row][col].piece.color === piecesColor) {
                legalMoves.push({
                    from: { row: row, col: col},
                    to: computeKingMoves(chessBoard, row, col, piecesColor)
                });
            }
            if (chessBoard[row][col].piece && chessBoard[row][col].piece.type === 'queen' && chessBoard[row][col].piece.color === piecesColor) {
                legalMoves.push({
                    from: { row: row, col: col},
                    to: computeQueenMoves(chessBoard, row, col, piecesColor)
                });
            }
        }
    }

    return legalMoves;
}

function validateMove(chessBoard, turn, piecesColor, from, to) {
    if (chessBoard[to.row][to.col].piece === null && chessBoard[from.row][from.col].piece.color === piecesColor && turn === piecesColor) {
        return true;
    }
    return false;
}

function applyMove(chessBoard, from, to) {
    const pieceToMove = chessBoard[from.row][from.col].piece;
    chessBoard[to.row][to.col].piece = pieceToMove;
    chessBoard[from.row][from.col].piece = null;
    return chessBoard;
}

module.exports = {
    generateChessBoard,
    flipBoard,
    computeLegalMoves,
    validateMove,
    applyMove,
}
