import type { User } from "./user"

export type Color = 'white' | 'black';

export type UserPlayer = {
    user: User | undefined;
    score: number;
    color: Color;
}

export type PieceType = {
    type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
    color: Color;
    value: number,
    id: number;
}

export type SquareType = {
    squareId: number;
    row: number;
    col: number;
    piece: PieceType;
}

export type CoordinateType = {
    row: number;
    col: number;
}

export type MoveType = {
    from: CoordinateType;
    to: CoordinateType;
}

export type LegalMoves = {
    from: CoordinateType;
    to: Array<CoordinateType>;
}

export type GameStatusType = {
    state: 'playing' | 'check' | 'checkmate' | 'stalemate';
    winner: User | null;
}

export type MatchType = {
    matchId: string;
    players: Array<User>;
    playerBlack: User;
    playerWhite: User;
    you: User;
    chessBoard: Array<Array<SquareType>>;
    legalMoves: Array<LegalMoves>;
    captures: CapturesType;
    piecesColor: Color;
    turn: string;
    gameStatus: GameStatusType;
}

export type CapturesType = {
    [key in Color]: Array<PieceType>;
}

export type BoardUpdatedType = {
    matchId: string;
    chessBoard: Array<Array<SquareType>>;
    legalMoves: Array<LegalMoves>;
    captures: CapturesType;
    piecesColor: Color;
    turn: string,
    gameStatus: GameStatusType;
}

export type GameOverType = {
    matchId: string;
    gameStatus: GameStatusType;
}

export type GamePhase =
    | 'idle'
    | 'finding'
    | 'starting'
    | 'playing'
    | 'check'
    | 'gameover'
