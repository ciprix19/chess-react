const boardSize = 8;

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
        boardMatrix[1][col].piece = { type: 'pawn', color: 'white'}
        boardMatrix[6][col].piece = { type: 'pawn', color: 'black'}
    }
    boardMatrix[0][0].piece = boardMatrix[0][7].piece = { type: 'rook', color: 'white'}
    boardMatrix[7][0].piece = boardMatrix[7][7].piece = { type: 'rook', color: 'black'}
    boardMatrix[0][1].piece = boardMatrix[0][6].piece = { type: 'knight', color: 'white'}
    boardMatrix[7][1].piece = boardMatrix[7][6].piece = { type: 'knight', color: 'black'}
    boardMatrix[0][2].piece = boardMatrix[0][5].piece = { type: 'bishop', color: 'white'}
    boardMatrix[7][2].piece = boardMatrix[7][5].piece = { type: 'bishop', color: 'black'}
    boardMatrix[0][3].piece = { type: 'king', color: 'white'}
    boardMatrix[7][3].piece = { type: 'king', color: 'black'}
    boardMatrix[0][4].piece = { type: 'queen', color: 'white'}
    boardMatrix[7][4].piece = { type: 'queen', color: 'black'}
    return boardMatrix;
}

module.exports = {
    generateChessBoard,
}
