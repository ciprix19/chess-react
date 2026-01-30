import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../../utils/socket-client/socket";
import ChessBoard from "./chessboard/chessboard";
import PlayerArea from "./player-area/player-area";
import type { User } from "../../utils/interfaces/user";
import './styles/play.css'

function ConnectionState({ isConnected } : {isConnected : boolean}) {
  return <p>Connection state: { '' + isConnected }</p>;
}

export default function Play() {
    const authContext = useContext(AuthContext);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isFindingMatch, setIsFindingMatch] = useState(false);
    const [info, setInfo] = useState('idle');
    const [enemyPlayer, setEnemyPlayer] = useState<User>();
    const [currentPlayer, setCurrentPlayer] = useState<User>();

    const findMatch = () => {
        if (!authContext.authSession) {
            setInfo('Please login');
            return;
        }

        if (!isFindingMatch) {
            socket.auth.token = authContext.authSession.accessToken;
            console.log(socket);
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

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on('game-ready', (data) => {
            setInfo('match found');
            if (data !== null) {
                // todo players are not sent correctly... i need to differentiate between them in some other way
                setCurrentPlayer(data.player1);
                setEnemyPlayer(data.player2);
                // i need timer here... 3 seconds delay type thing
            }
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, [socket]);

    return (
        <main className="play">
            <h1>Chess</h1>
            <ConnectionState isConnected={ isConnected } />
            <div className='three-column-layout'>
                <div className='card-simple'>
                    <h3>{currentPlayer?.email}</h3>
                </div>
                <h2>VS</h2>
                <div className='card-simple'>
                    <h3>{enemyPlayer?.email}</h3>
                </div>
            </div>
            {info && <p>{info}</p>}
            <button onClick={findMatch}>Find Match</button>
        </main>
    );
}