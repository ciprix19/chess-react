import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../../utils/socket-client/socket";
import ChessBoard from "./chessboard/chessboard";
import type { User } from "../../utils/interfaces/user";
import './styles/play.css'
import type { UserPlayer, GamePhase, BoardUpdatedType, CapturesType, Color, MatchType } from "../../utils/interfaces/chess-types";
import { useGameAudio } from "../../utils/hooks/useGameAudio";
import { useMatch } from "../../utils/hooks/useMatch";

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
    const [isConnected, setIsConnected] = useState(socket.connected);
    const { match, currentPlayer, enemyPlayer, gamePhase, info, findMatch } = useMatch();

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
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