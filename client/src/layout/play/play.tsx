import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../../utils/socket-client/socket";
import ChessBoard from "./chessboard/chessboard";
import type { User } from "../../utils/interfaces/user";
import './styles/play.css'
import type { BoardUpdatedType, MatchType, SquareType } from "../../utils/interfaces/chess-types";

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
    const [match, setMatch] = useState<MatchType>();

    function handleFlipBoard(chessBoard : Array<Array<SquareType>>) {
        //todo - flipping is a visual thing only -> no need to call backend for this
        // return chessBoard.map(row => [...row].reverse()).reverse();
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

        function onGameReady(data: MatchType) {
            // i need timer here... 3 seconds delay type thing
            try {
                console.log(data);
                const match : MatchType = {
                    matchId: data.matchId,
                    players: data.players,
                    playerBlackPieces: data.playerBlackPieces,
                    playerWhitePieces: data.playerWhitePieces,
                    you: data.you,
                    chessBoard: data.chessBoard,
                    // chessBoard: data.chessBoard,
                    legalMoves: data.legalMoves,
                    piecesColor: data.piecesColor,
                    turn: data.turn,
                }

                setInfo('White moves');
                setMatch(match);
                setCurrentPlayer(data.players.find(p => p.email === data.you.email));
                setEnemyPlayer(data.players.find(p => p.email !== data.you.email));
            } catch (error) {
                console.log(error);
            }
        }

        function onBoardUpdated(data: BoardUpdatedType) {
            try {
                setMatch(prev => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        chessBoard: data.chessBoard,
                        legalMoves: data.legalMoves,
                        turn: data.turn,
                    };
                });

                setInfo(`${data.turn} moves`);
            } catch (error) {
                console.log(error);
            }
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('game-ready', onGameReady);
        socket.on('board-updated', onBoardUpdated);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('game-ready', onGameReady);
            socket.off('board-updated', onBoardUpdated);
        }
    }, [socket]);

    return (
        <main className="play">
            <h1>Chess</h1>
            <ConnectionState isConnected={ isConnected } user={authContext.authSession?.user} />
            <div className='card-simple'>
                <h3>{enemyPlayer?.email}</h3>
            </div>
            {match && <ChessBoard match={match}/>}
            <div className='card-simple'>
                <h3>{currentPlayer?.email}</h3>
            </div>
            {info && <p>{info}</p>}
            <button>Flip board</button>
            <button onClick={findMatch}>Find Match</button>
        </main>
    );
}