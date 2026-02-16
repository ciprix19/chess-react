import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../../utils/socket-client/socket";
import type { BoardUpdatedType, Color, GamePhase, MatchType, UserPlayer } from "../interfaces/chess-types";
import { useGameAudio } from "./useGameAudio";

export function useMatch() {
    const authContext = useContext(AuthContext);
    const audio = useGameAudio();
    const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
    const [info, setInfo] = useState('');
    const [enemyPlayer, setEnemyPlayer] = useState<UserPlayer>();
    const [currentPlayer, setCurrentPlayer] = useState<UserPlayer>();
    const [match, setMatch] = useState<MatchType>();

    function getOpponentColor(color: Color) : Color {
        return color === 'white' ? 'black' : 'white';
    }

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

    useEffect(() => {
        function onGameReady(data: MatchType) {
            // todo: i need timer here... 3 seconds delay type thing
            try {
                console.log(data);
                setGamePhase('playing');
                setMatch(data);

                setCurrentPlayer({
                    user: data.players.find(p => p.email === data.you.email),
                    score: 0,
                    color: data.piecesColor
                });
                setEnemyPlayer({
                    user: data.players.find(p => p.email !== data.you.email),
                    score: 0,
                    color: getOpponentColor(data.piecesColor)
                });

                setInfo('White moves');
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
        socket.on('game-ready', onGameReady);
        socket.on('board-updated', onBoardUpdated);
        return () => {
            socket.off('game-ready', onGameReady);
            socket.off('board-updated', onBoardUpdated);
        }
    }, []);

    return {
        match,
        currentPlayer,
        enemyPlayer,
        gamePhase,
        info,
        findMatch
    };
}
