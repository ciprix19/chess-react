import { useEffect, useState, type MouseEvent } from 'react';
import './styles/chessboard.css'
import type { CoordinateType, LegalMoves, MatchType, MoveType, PieceType, SquareType } from '../../../utils/interfaces/chess-types';
import { socket } from '../../../utils/socket-client/socket';

let displayRowValuesReversed = ['8', '7', '6', '5', '4', '3', '2', '1'];
let displayRowValues = ['1', '2', '3', '4', '5', '6', '7', '8'];
let displayColumnValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function Piece({ piece } : { piece: PieceType }) {
    return (
        <div className='piece'
             onClick={() => {console.log(piece.id)}}
             >
            <img src={`./images/pieces/${piece.type}-${piece.color}.svg`} alt='' />
        </div>
    );
}

function MoveHighlight() {
    return (
        <div className='move-highlight'></div>
    );
}

function Square({ squareId, row, col, piece, onClick, isSelected, isHighlighted } : SquareType & {
        onClick: (row: number, col: number) => void;
        isSelected: boolean;
        isHighlighted: boolean;
    }) {

    return (
        <div key={squareId} className={`square ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(row, col)}>
            {isHighlighted && <MoveHighlight />}
            {piece && <Piece piece={piece}/>}
            {/* <p>{displayRowValuesReversed[row]}, {displayColumnValues[col]}</p> */}
            {/* <p>{row}, {col}</p> */}
        </div>
    );
}

export default function ChessBoard({ match } : { match: MatchType }) {
    const [selectedSquare, setSelectedSquare] = useState<{
        row: number,
        col: number
    } | null>(null);
    const [highlightedMoves, setHighlightedMoves] = useState<Array<CoordinateType> | null>();

    function getMovesForSquare(row: number, col: number) : Array<CoordinateType> | null {
        for (let move of match.legalMoves) {
            if (move.from.row === row && move.from.col === col)
                return move.to;
        }
        return null;
    }

    function handleSquareClick(row: number, col: number) {
        // if no selection
        if (!selectedSquare) {
            const moves = getMovesForSquare(row, col);
            if (moves !== null) {
                setSelectedSquare({ row, col });
                setHighlightedMoves(moves);
            }
            return;
        }

        // square is selected and i try to move
        const isLegalTarget = highlightedMoves?.some(m => m.row === row && m.col === col);

        if (isLegalTarget) {
            socket.emit('client-move', {
                matchId: match.matchId,
                from: selectedSquare,
                to: { row, col },
                piecesColor: match.piecesColor
            });
        }

        setSelectedSquare(null);
        setHighlightedMoves(null);
    }

    return (
        <div className='chess-board'>
            <div className='position-wrapper'>
                <div className='row-coordinates'>
                    {displayRowValuesReversed.map((val) => {
                        return <div key={val}>{val}</div>
                    })}
                </div>
                <div className='board'>
                    {match.chessBoard.map((row) => {
                        return row.map((val) => {
                            const isSelected = selectedSquare?.row === val.row && selectedSquare?.col === val.col;
                            let isHighlighted = false;
                            if (highlightedMoves) {
                                isHighlighted = highlightedMoves.some(move => move.row === val.row && move.col === val.col);
                            }
                            return (
                                <Square
                                    key={val.squareId}
                                    {...val}
                                    onClick={handleSquareClick}
                                    isSelected={isSelected}
                                    isHighlighted={isHighlighted}
                                />
                            );
                        });
                    })}
                </div>
            </div>
            <div className='column-coordinates'>
                {displayColumnValues.map((val) => {
                    return <div key={val}>{val}</div>
                })}
            </div>
        </div>
    );
}
