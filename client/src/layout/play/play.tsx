import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../../utils/socket-client/socket";
import ChessBoard from "./chessboard/chessboard";
import type { User } from "../../utils/interfaces/user";
import './styles/play.css'
import type { SquareType } from "../../utils/interfaces/chess-types";

type GameReadyDataType = {
    matchId: string,
    players: Array<User>,
    you: string,
    chessBoard: Array<Array<SquareType>>,
    piecesColor: string,
    turn: string,
}


function ConnectionState({ isConnected, user } : { isConnected : boolean, user : User | undefined }) {
  return <p>Connection state: { user?.email + ' ' + isConnected }</p>;
}

export default function Play() {
    const authContext = useContext(AuthContext);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isFindingMatch, setIsFindingMatch] = useState(false);
    const [info, setInfo] = useState('idle');
    const [enemyPlayer, setEnemyPlayer] = useState<User>();
    const [currentPlayer, setCurrentPlayer] = useState<User>();
    const [chessBoard, setChessBoard] = useState<Array<Array<SquareType>>>();
    const [turn, setTurn] = useState('');
    const [piecesColor, setPiecesColor] = useState('');

    function handleFlipBoard() {
        //todo - flipping is a visual thing only -> no need to call backend for this
    }

    const findMatch = () => {
        if (!authContext.authSession) {
            setInfo('Please login');
            return;
        }

        if (!isFindingMatch) {
            socket.auth.token = authContext.authSession.accessToken;
            socket.connect();
            socket.emit('find-match');
            setIsFindingMatch(true);
            setInfo('Finding Match...');
        }
    }

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onGameReady(data: GameReadyDataType) {
            setInfo('match found');
            // i need timer here... 3 seconds delay type thing
            try {
                console.log(data);
                setCurrentPlayer(data.players.find(p => p.email === data.you));
                setEnemyPlayer(data.players.find(p => p.email !== data.you));
                setChessBoard(data.chessBoard);
                setPiecesColor(data.piecesColor);
                setTurn(data.turn);
            } catch (error) {
                console.log(error);
            }
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('game-ready', onGameReady);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('game-ready', onGameReady);
        }
    }, [socket]);

    return (
        <main className="play">
            <h1>Chess</h1>
            <ConnectionState isConnected={ isConnected } user={authContext.authSession?.user} />
            <div className='card-simple'>
                <h3>{currentPlayer?.email}</h3>
            </div>
            {chessBoard && <ChessBoard chessBoard={chessBoard} />}
            <div className='card-simple'>
                <h3>{enemyPlayer?.email}</h3>
            </div>
            {info && <p>{info}</p>}
            <button onClick={handleFlipBoard}>Flip board</button>
            <button onClick={findMatch}>Find Match</button>
        </main>
    );
}