import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../../utils/socket-client/socket";
import type { BoardUpdatedType, Color, GameOverType, GamePhase, MatchType, UserPlayer } from "../interfaces/chess-types";
import { useGameAudio } from "./useGameAudio";
import type { User } from "../interfaces/user";

export function useMatch() {
    const authContext = useContext(AuthContext);
    const audio = useGameAudio();
    const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
    const [info, setInfo] = useState('Click to find match...');
    const [enemyPlayer, setEnemyPlayer] = useState<UserPlayer>();
    const [currentPlayer, setCurrentPlayer] = useState<UserPlayer>();
    const [drawOfferReceived, setDrawOfferReceived] = useState(false);
    const [match, setMatch] = useState<MatchType>();

    function getOpponentColor(color: Color) : Color {
        return color === 'white' ? 'black' : 'white';
    }

    const handleFindMatch = () => {
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

    //todo: handle rematch
    const handleRematch = () => {
        if (!authContext.authSession) {
            setInfo('Please login');
            return;
        }

        if (gamePhase === 'gameover') {
            socket.auth.token = authContext.authSession.accessToken;
            socket.emit('rematch');
            setGamePhase('waiting-for-rematch');
            setInfo('Waiting for rematch...')
        }
    }

    const handleDraw = () => {
        if (!authContext.authSession) {
            setInfo('Please login');
            return;
        }
        if (!match) return;
        if (gamePhase === 'playing' || gamePhase === 'check') {
            socket.auth.token = authContext.authSession.accessToken;
            socket.emit('draw', { matchId: match.matchId, you: match.you });
            setInfo('Draw offer sent...')
        }
    }

    const handleDrawAccepted = (answer: boolean) => {
        if (answer === true) {
            if (!authContext.authSession) {
                setInfo('Please login');
                return;
            }
            if (!match) return;
            socket.auth.token = authContext.authSession.accessToken;
            socket.emit('draw-accepted', { matchId: match.matchId });
        }
        setDrawOfferReceived(false);
    }

    const handleResign = () => {
        if (!authContext.authSession) {
            setInfo('Please login');
            return;
        }
        if (!match) return;
        if (gamePhase === 'playing' || gamePhase === 'check') {
            socket.auth.token = authContext.authSession.accessToken;
            socket.emit('resign', { matchId: match.matchId, piecesColor: match.piecesColor, you: match.you });
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
        function onGameOverByAgreement(data: GameOverType) {
            console.log(data);
            setGamePhase('gameover');
            let enemyColor = getOpponentColor(data.gameStatus.winnerColor);
            if (data.gameStatus.state === 'resign') {
                setInfo(enemyColor.charAt(0).toUpperCase() + enemyColor.slice(1) + ' resigned. ' + data.gameStatus.winnerColor.charAt(0).toUpperCase() + data.gameStatus.winnerColor.slice(1) + ' won.');
            } else if (data.gameStatus.state === 'draw-agreement') {
                setInfo('Draw');
            }
        }

        function onDrawOffer(data: { matchId: number, from: User }) {
            console.log(data);
            setDrawOfferReceived(true);
        }

        socket.on('game-ready', onGameReady);
        socket.on('board-updated', onBoardUpdated);
        socket.on('draw-offer', onDrawOffer);
        socket.on('gameover-by-agreement', onGameOverByAgreement);
        return () => {
            socket.off('game-ready', onGameReady);
            socket.off('board-updated', onBoardUpdated);
            socket.off('draw-offer', onDrawOffer);
            socket.off('gameover-by-agreement', onGameOverByAgreement);
        }
    }, []);

    useEffect(() => {
    console.log("drawOfferReceived changed:", drawOfferReceived);
}, [drawOfferReceived]);

    return {
        match,
        currentPlayer,
        enemyPlayer,
        gamePhase,
        drawOfferReceived,
        handleDrawAccepted,
        info,
        handleFindMatch,
        handleRematch,
        handleDraw,
        handleResign
    };
}
