import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../../utils/socket-client/socket";
import ChessBoard from "./chessboard/chessboard";
import type { User, UserPlayer } from "../../utils/interfaces/user";
import './styles/play.css'
import type { BoardUpdatedType, Color, MatchType, SquareType } from "../../utils/interfaces/chess-types";
import captureSoundFile from '../../../public/sounds/capture.mp3'
import moveSelfSoundFile from '../../../public/sounds/move-self.mp3'

let captureSound = new Audio(captureSoundFile);
let moveSelfSound = new Audio(moveSelfSoundFile);

function ConnectionState({ isConnected, user } : { isConnected : boolean, user : User | undefined }) {
  return <p>Connection state: { user?.email + ' ' + isConnected }</p>;
}

export default function Play() {
    const authContext = useContext(AuthContext);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isFindingMatch, setIsFindingMatch] = useState(false);
    const [info, setInfo] = useState('idle');
    const [enemyPlayer, setEnemyPlayer] = useState<UserPlayer>();
    const [currentPlayer, setCurrentPlayer] = useState<UserPlayer>();
    const [match, setMatch] = useState<MatchType>();

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
            // todo: i need timer here... 3 seconds delay type thing
            try {
                const match : MatchType = {
                    matchId: data.matchId,
                    players: data.players,
                    playerBlack: data.playerBlack,
                    playerWhite: data.playerWhite,
                    you: data.you,
                    chessBoard: data.chessBoard,
                    legalMoves: data.legalMoves,
                    captures: data.captures,
                    piecesColor: data.piecesColor,
                    turn: data.turn,
                    gameStatus: data.gameStatus
                }

                setInfo('White moves');
                setMatch(match);
                setCurrentPlayer({ user: data.players.find(p => p.email === data.you.email), score: 0, color: data.piecesColor });
                setEnemyPlayer({ user: data.players.find(p => p.email !== data.you.email), score: 0, color: data.piecesColor === 'white' ? 'black' : 'white' });
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
                        captures: data.captures,
                        turn: data.turn,
                        gameStatus: data.gameStatus
                    };
                });

                setInfo(`${data.turn} moves`);
                setCurrentPlayer(prev => {
                    if (!prev) return prev;
                    const currentScore = data.captures[prev.color as Color].reduce((sum, piece) => sum + piece.value, 0);
                    return {
                        ...prev,
                        score: currentScore
                    }
                });
                setEnemyPlayer(prev => {
                    if (!prev) return prev;
                    const currentScore = data.captures[prev.color as Color].reduce((sum, piece) => sum + piece.value, 0);
                    return {
                        ...prev,
                        score: currentScore
                    }
                });

                if (match !== undefined && (
                    match.captures['white'].length < data.captures['white'].length ||
                    match.captures['black'].length < data.captures['black'].length
                )) {
                    captureSound.play();
                } else {
                    moveSelfSound.play();
                }
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
    }, [match]);

    return (
        <main className="play two-column-layout">
            {match && enemyPlayer && currentPlayer &&
                <div>
                    <div className='card player-panel'>
                        <p>{enemyPlayer?.score > 0 ? `+${enemyPlayer.score}` : ''}</p>
                        <div className='captured-pieces'>
                            {match.captures[enemyPlayer.color as Color].map(piece =>
                                <img key={piece.id} src={`./images/pieces/${piece.type}-${piece.color}.svg`} alt='' />
                            )}
                        </div>
                    </div>
                    <h3>Player: {enemyPlayer.user?.email}</h3>
                    <ChessBoard match={match}/>
                    <div className='card player-panel'>
                        <p>{currentPlayer?.score > 0 ? `+${currentPlayer.score}` : ''}</p>
                        <div className='captured-pieces'>
                            {match.captures[currentPlayer.color as Color].map(piece =>
                                <img key={piece.id} src={`./images/pieces/${piece.type}-${piece.color}.svg`} alt='' />
                            )}
                        </div>
                    </div>
                    <h3>Player: {currentPlayer.user?.email}</h3>
                </div>
            }
            <div>
                {info && <h2>{info}</h2>}
                <button onClick={findMatch}>Find Match</button>
            </div>
        </main>
    );
}