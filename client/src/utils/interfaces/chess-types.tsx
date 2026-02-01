export type PieceType = {
    type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king'
    color: 'white' | 'black'
}

export type SquareType = {
    squareId: number,
    row: number,
    col: number,
    piece: PieceType | undefined
}
