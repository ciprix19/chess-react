const config = require('./config/gameConfig.json');
const boardSize = config.boardSize;

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
        boardMatrix[1][col].piece = { type: 'pawn', color: 'black', value: 1 };
        boardMatrix[6][col].piece = { type: 'pawn', color: 'white', value: 1 };
    }
    boardMatrix[0][0].piece = { type: 'rook', color: 'black', value: 5, didMove: false };
    boardMatrix[0][7].piece = { type: 'rook', color: 'black', value: 5, didMove: false };
    boardMatrix[7][0].piece = { type: 'rook', color: 'white', value: 5, didMove: false };
    boardMatrix[7][7].piece = { type: 'rook', color: 'white', value: 5, didMove: false };
    boardMatrix[0][1].piece = { type: 'knight', color: 'black', value: 3 };
    boardMatrix[0][6].piece = { type: 'knight', color: 'black', value: 3 };
    boardMatrix[7][1].piece = { type: 'knight', color: 'white', value: 3 };
    boardMatrix[7][6].piece = { type: 'knight', color: 'white', value: 3 };
    boardMatrix[0][2].piece = { type: 'bishop', color: 'black', value: 3 };
    boardMatrix[0][5].piece = { type: 'bishop', color: 'black', value: 3 };
    boardMatrix[7][2].piece = { type: 'bishop', color: 'white', value: 3 };
    boardMatrix[7][5].piece = { type: 'bishop', color: 'white', value: 3 };
    boardMatrix[0][4].piece = { type: 'king', color: 'black', value: 0, didMove: false };
    boardMatrix[7][4].piece = { type: 'king', color: 'white', value: 0, didMove: false };
    boardMatrix[0][3].piece = { type: 'queen', color: 'black', value: 9 };
    boardMatrix[7][3].piece = { type: 'queen', color: 'white', value: 9 };

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

module.exports = {
    generateChessBoard,
}
