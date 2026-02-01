import { useEffect, useState } from 'react';
import './styles/chessboard.css'
import type { SquareType } from '../../../utils/interfaces/chess-types';
// import { socket } from "../../utils/socket-client/socket";

let displayRowValuesReversed = ['8', '7', '6', '5', '4', '3', '2', '1'];
let displayRowValues = ['1', '2', '3', '4', '5', '6', '7', '8'];
let displayColumnValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function Square({ squareId, row, col, piece } : SquareType) {
    return (
        //the colors are not good
        <div key={squareId} className='square'>
            {piece && <img src={`./images/pieces/${piece.type}-${piece.color}.svg`} alt='' />}
            {/* <p>{displayRowValuesReversed[row]}, {displayColumnValues[col]}</p>
            <p>{row}, {col}</p> */}
        </div>
    );
}

export default function ChessBoard({ chessBoard } : { chessBoard: Array<Array<SquareType>> }) {

    return (
        <div className='chess-board'>
            <div className='board'>
                <div className='row-coordinates'>
                    {displayRowValuesReversed.map((val) => {
                        return <div key={val}>{val}</div>
                    })}
                </div>
                {chessBoard.map((row) => {
                    return row.map((val) => {
                        return (
                            <Square
                                squareId={val.squareId}
                                row={val.row}
                                col={val.col}
                                piece={val.piece}
                            />
                        );
                    });
                })}
            </div>
            <div className='column-coordinates'>
                {displayColumnValues.map((val) => {
                    return <div key={val}>{val}</div>
                })}
            </div>
        </div>
    );
}
