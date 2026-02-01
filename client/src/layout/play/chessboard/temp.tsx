//todo, should i make 2 functions for each color?... not sure how that would work out with the backend and the coordinates
// translate chessboard might be required
// board must be defined starting from bottom left, going to top right
// bottom left must always be black
// in chess notation, starting from bottom left, rows are numbered from 1 to 8 (going top), columns from A to H (going right)
// true means black, false means white -> only in this function for simpler generation purpose
// function generateChessBoard() : Array<Array<Square>>  {
//     let boardMatrix : Array<Array<Square>> = [];
//     let squareIdCounter = 0;
//     let startingColor = false;
//     for (let row = 0; row < boardSize; row++) {
//         let tempArr : Array<Square> = [];
//         for (let col = 0; col < boardSize; col++) {
//             let Square : Square = {
//                 squareId: squareIdCounter++,
//                 row: row,
//                 col: col,
//                 color: startingColor ? 'black' : 'white',
//                 displayRow: displayRowValues[row],
//                 displayColumn: displayColumnValues[col],
//                 piece: undefined
//             };
//             startingColor = !startingColor;
//             tempArr.push(Square);
//         }
//         startingColor = !startingColor;
//         boardMatrix.push(tempArr);
//     }
//     for (let col = 0; col < boardSize; col++) {
//         boardMatrix[1][col].piece = { type: 'pawn', color: 'white'}
//         boardMatrix[6][col].piece = { type: 'pawn', color: 'black'}
//     }
//     boardMatrix[0][0].piece = boardMatrix[0][7].piece = { type: 'rook', color: 'white'}
//     boardMatrix[7][0].piece = boardMatrix[7][7].piece = { type: 'rook', color: 'black'}
//     boardMatrix[0][1].piece = boardMatrix[0][6].piece = { type: 'knight', color: 'white'}
//     boardMatrix[7][1].piece = boardMatrix[7][6].piece = { type: 'knight', color: 'black'}
//     boardMatrix[0][2].piece = boardMatrix[0][5].piece = { type: 'bishop', color: 'white'}
//     boardMatrix[7][2].piece = boardMatrix[7][5].piece = { type: 'bishop', color: 'black'}
//     boardMatrix[0][3].piece = { type: 'king', color: 'white'}
//     boardMatrix[7][3].piece = { type: 'king', color: 'black'}
//     boardMatrix[0][4].piece = { type: 'queen', color: 'white'}
//     boardMatrix[7][4].piece = { type: 'queen', color: 'black'}
//     // console.log(boardMatrix);
//     return boardMatrix;
// }

// function handleFlipBoard() {
//     const chessBoardAux = chessBoard;
//     for (let i = 0; i < boardSize; i++) {
//         for (let j = 0; j < boardSize; j++) {
//             if (i + j < boardSize - 1) {
//                 const newi = boardSize - 1 - i;
//                 const newj = boardSize - 1 - j;
//                 if (i > newi || (i === newi && j >= newj)) continue;
//                 [chessBoard[i][j], chessBoard[newi][newj]] = [chessBoard[newi][newj], chessBoard[i][j]];
//             }
//         }
//     }
//     return chessBoard;
// }
