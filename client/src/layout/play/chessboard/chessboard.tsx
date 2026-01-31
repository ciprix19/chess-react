import './styles/chessboard.css'
// import { socket } from "../../utils/socket-client/socket";

const rows = 8;
const columns = 8;
// let displayRowValues = ['1', '2', '3', '4', '5', '6', '7', '8'];
let displayRowValues = ['8', '7', '6', '5', '4', '3', '2', '1'];
let displayColumnValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

type Cell = {
    cellId: number,
    row: number,
    col: number,
    color: string,
    displayRow: string,
    displayColumn: string,
}

export default function ChessBoard() {
    // board needs to look like: [{row, col, color}...]
    const chessboard = generateChessBoard();

    //todo, should i make 2 functions for each color?... not sure how that would work out with the backend and the coordinates
    // translate chessboard might be required
    function generateChessBoard() : Array<Array<Cell>>  {
        let boardMatrix : Array<Array<Cell>> = [];
        // board must be defined starting from bottom left, going to top right
        // bottom left must always be black
        // in chess notation, starting from bottom left, rows are numbered from 1 to 8 (going top), columns from A to H (going right)
        // true means black, false means white -> only in this function for simpler generation purpose
        let startingColor = false;
        let cellIdCounter = 0;
        // for (let row = 0; row < rows; row++) {
        //     let tempArr : Array<Cell> = [];
        //     for (let col = 0; col < columns; col++) {
        for (let row = rows - 1; row >= 0; row--) {
            let tempArr : Array<Cell> = [];
            for (let col = 0; col < columns; col++) {
                let cell : Cell = {
                    cellId: cellIdCounter++,
                    row: row,
                    col: col,
                    color: startingColor ? 'black' : 'white',
                    displayRow: displayRowValues[row],
                    displayColumn: displayColumnValues[col]
                }
                startingColor = !startingColor;
                tempArr.push(cell);
            }
            startingColor = !startingColor;
            boardMatrix.push(tempArr);
        }
        console.log(boardMatrix);
        return boardMatrix;
    }

    return (
        <div className='chessboard'>
            <div className='two-column'>
                <div className='row-coordinates'>
                    {displayRowValues.map((val) => {
                        return <div key={val}>{val}</div>
                    })}
                </div>
                <div className='board'>
                    {chessboard.map((row) => {
                        return row.map((val) => {
                            return <div key={val.cellId} className={`cell ${val.color}`}></div>
                        });
                    })}
                </div>
            </div>
            <div className='column-coordinates'>
                <div></div>
                {displayColumnValues.map((val) => {
                    return <div key={val}>{val}</div>
                })}
            </div>
        </div>
    );
}
