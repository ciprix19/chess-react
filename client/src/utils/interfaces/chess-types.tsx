import type { User } from "./user"

export type PieceType = {
    type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
    color: 'white' | 'black';
    id: number
}

export type SquareType = {
    squareId: number;
    row: number;
    col: number;
    piece: PieceType
}

export type CoordinateType = {
    row: number;
    col: number
}

export type MoveType = {
    from: CoordinateType;
    to: CoordinateType
}

export type LegalMoves = {
    from: CoordinateType;
    to: Array<CoordinateType>
}

export type GameStatusType = {
    state: 'playing' | 'check' | 'checkmate' | 'stalemate';
    winner: 'User' | null;
}

export type MatchType = {
    matchId: string;
    players: Array<User>;
    playerBlackPieces: User;
    playerWhitePieces: User;
    you: User;
    chessBoard: Array<Array<SquareType>>;
    legalMoves: Array<LegalMoves>;
    piecesColor: string;
    turn: string;
    gameStatus: GameStatusType;
}

export type BoardUpdatedType = {
    matchId: string;
    chessBoard: Array<Array<SquareType>>;
    legalMoves: Array<LegalMoves>;
    piecesColor: string;
    turn: string,
    gameStatus: GameStatusType;
}

export type CheckInfo = {
    inCheck: boolean;
    checkedColor: 'white' | 'black' | null;
    kingPosition: CoordinateType | null;
}
