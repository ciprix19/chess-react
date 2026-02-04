import type { User } from "./user"

export type PieceType = {
    type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king',
    color: 'white' | 'black',
    id: number
}

export type SquareType = {
    squareId: number,
    row: number,
    col: number,
    piece: PieceType | undefined
}

export type CoordinateType = {
    row: number,
    col: number
}

export type MoveType = {
    from: CoordinateType,
    to: CoordinateType
}

export type LegalMoves = {
    from: CoordinateType,
    to: Array<CoordinateType>
}

export type MatchType = {
    matchId: string,
    players: Array<User>,
    you: string,
    chessBoard: Array<Array<SquareType>>,
    piecesColor: string,
    legalMoves: Array<LegalMoves>,
    turn: string,
}
