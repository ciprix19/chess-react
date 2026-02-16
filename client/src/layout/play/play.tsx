import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../../utils/socket-client/socket";
import ChessBoard from "./chessboard/chessboard";
import type { User } from "../../utils/interfaces/user";
import './styles/play.css'
import type { UserPlayer, GamePhase, BoardUpdatedType, CapturesType, Color, MatchType } from "../../utils/interfaces/chess-types";
import { useGameAudio } from "../../utils/hooks/useGameAudio";

function ConnectionState({ isConnected, user } : { isConnected : boolean, user : User | undefined }) {
  return <p>Connection state: { user?.email + ' ' + isConnected }</p>;
}

function PlayerPanel({ player, captures } : { player: UserPlayer, captures: CapturesType }) {
    const sortedCaptures = useMemo(() => {
        return [...captures[player.color]].sort((piece1, piece2) => piece1.value - piece2.value);
    }, [captures, player.color]);

    return (
        <div className='card player-panel'>
            <p>{player?.score > 0 ? `+${player.score}` : ''}</p>
            <div className='captured-pieces'>
                {sortedCaptures.map(piece =>
                    <img key={piece.id} src={`./images/piecesv2/${piece.type}-${piece.color}.svg`} alt='' />
                )}
            </div>
        </div>
    );
}

export default function Play() {
    const authContext = useContext(AuthContext);
    const audio = useGameAudio();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
    const [info, setInfo] = useState('');
    const [enemyPlayer, setEnemyPlayer] = useState<UserPlayer>();
    const [currentPlayer, setCurrentPlayer] = useState<UserPlayer>();
    const [match, setMatch] = useState<MatchType>();

    const findMatch = () => {
        if (!authContext.authSession) {
            setInfo('Please login');
            return;
        }

        if (gamePhase !== 'finding') {
            socket.auth.token = authContext.authSession.accessToken;
            socket.connect();
            socket.emit('find-match');
            setGamePhase('finding');
            setInfo('Finding Match...');
        }
    }

    function getOpponentColor(color: Color) : Color {
        return color === 'white' ? 'black' : 'white';
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
                console.log(data);
                setInfo('White moves');
                setGamePhase('playing');
                setMatch(match);
                setCurrentPlayer({ user: data.players.find(p => p.email === data.you.email), score: 0, color: data.piecesColor });
                setEnemyPlayer({ user: data.players.find(p => p.email !== data.you.email), score: 0, color: getOpponentColor(data.piecesColor) });
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

                switch (data.gameStatus.state) {
                    case 'playing':
                        // i should not use 'match' in the dependency array for sockets
                        // since sounds are only a client thing, not crucial for the server, i think that i need to implement move history
                        // in backend and send the whole history to the frontend, the client should then be able to view previous moves
                        // and i can handle sounds based on history
                        // if (match !== undefined && (
                        //     match.captures['white'].length < data.captures['white'].length ||
                        //     match.captures['black'].length < data.captures['black'].length
                        // )) {
                        //     audioVariables.captureSound.play();
                        // } else {
                        //     audioVariables.moveSelfSound.play();
                        // }
                        setGamePhase('playing');
                        audio.playMove();
                        break;
                    case 'check':
                        setGamePhase('check');
                        audio.playCheck();
                        break;
                    case 'checkmate':
                        setInfo(data.gameStatus.winner?.email + ' won');
                        audio.playGameEnd();
                        setGamePhase('gameover');
                        break;
                    case 'stalemate':
                        setInfo(data.gameStatus.state);
                        // need smth different here
                        audio.playGameEnd();
                        setGamePhase('gameover');
                        break;
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
    }, []);

    return (
        <main className="play two-column-layout">
            {match && enemyPlayer && currentPlayer &&
                <div>
                    <h3>Player: {enemyPlayer.user?.email}</h3>
                    <PlayerPanel player={enemyPlayer} captures={match.captures} />
                    <ChessBoard match={match}/>
                    <PlayerPanel player={currentPlayer} captures={match.captures} />
                    <h3>Player: {currentPlayer.user?.email}</h3>
                </div>
            }
            <div>
                {info && <h2>{info}</h2>}
                {gamePhase === 'idle' && <button onClick={findMatch}>Find Match</button>}
            </div>
        </main>
    );
}