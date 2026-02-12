import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
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
            <img src={`./images/piecesv2/${piece.type}-${piece.color}.svg`} alt='' />
        </div>
    );
}

function MoveHighlight({ isHighlighted, piece, children } : { isHighlighted: boolean, piece: PieceType, children: ReactNode }) {
    return (
        <>
            {isHighlighted ?
                <div className={`${piece === null ? 'move-highlight' : 'capture-highlight'}`}>
                    {children}
                </div> :
                <div>
                    {children}
                </div>
            }
        </>
    );
}

function Square({ squareId, row, col, piece, onClick, isSelected, isHighlighted } : SquareType & {
        onClick: (row: number, col: number) => void;
        isSelected: boolean;
        isHighlighted: boolean;
    }) {

    const [isRightClicked, setIsRightClicked] = useState(false);

    function handleRightClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.button === 2) {
            e.preventDefault();
            setIsRightClicked(!isRightClicked);
            console.log(piece);
        }
    }

    return (
        <div key={squareId}
            className={`square ${isSelected || isRightClicked ? 'selected' : ''}`}
            onClick={() => onClick(row, col)}
            onContextMenu={e => handleRightClick(e)}
        >
            <MoveHighlight isHighlighted={isHighlighted} piece={piece}>
                {piece && <Piece piece={piece}/>}
            </MoveHighlight>
            {/* <p>{displayRowValuesReversed[row]}, {displayColumnValues[col]}</p> */}
            {/* <p>{row}, {col}</p> */}
            {/* <p>{squareId}</p> */}
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
        if (
            !selectedSquare || // or there is a selection but i click one of my pieces...
            (
                selectedSquare &&
                match.chessBoard[row][col].piece &&
                match.chessBoard[row][col].piece.color === match.chessBoard[selectedSquare.row][selectedSquare.col].piece.color
            )
        ) {
            console.log(match.chessBoard[row][col]);
            if (match.chessBoard[row][col].piece !== null) {
                const moves = getMovesForSquare(row, col);
                setSelectedSquare({ row, col });
                setHighlightedMoves(null);
                if (moves !== null) {
                    setHighlightedMoves(moves);
                }
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
                <div className={`board ${match.piecesColor === 'black' ? 'flipped' : ''}`}>
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
