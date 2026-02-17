import { socket } from "../../utils/socket-client/socket";
import ChessBoard from "./chessboard/chessboard";
import type { User } from "../../utils/interfaces/user";
import './styles/play.css'
import { useMatch } from "../../utils/hooks/useMatch";
import { useEffect, useState } from "react";
import { PlayerArea } from "./player-area/player-area";
import Dashboard from "./dashboard/dashboard";
import Landing from "./landing/landing";

function ConnectionState({ isConnected, user } : { isConnected : boolean, user : User | undefined }) {
  return <p>Connection state: { user?.email + ' ' + isConnected }</p>;
}

export default function Play() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const { match, currentPlayer, enemyPlayer, gamePhase, info, handleFindMatch, handleRematch, handleDraw, handleResign } = useMatch();

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
        <main className='play'>
            {match && enemyPlayer && currentPlayer ?
                <div className='two-column-layout'>
                    <div className='play-area'>
                        <PlayerArea player={enemyPlayer} captures={match.captures} timerValueInMinutes={5}/>
                        <ChessBoard match={match}/>
                        <PlayerArea player={currentPlayer} captures={match.captures} timerValueInMinutes={5} />
                    </div>
                    <Dashboard
                        gamePhase={gamePhase}
                        info={info}
                        handleFindMatch={handleFindMatch}
                        handleRematch={handleRematch}
                        handleDraw={handleDraw}
                        handleResign={handleResign}
                    />
                </div> :
                <Landing info={info} handleFindMatch={handleFindMatch}/>
            }
        </main>
    );
}