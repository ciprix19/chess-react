import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/context/authContext";
import { socket } from "../play/socket";

function ConnectionState({ isConnected }: { isConnected: boolean }) {
    return <p>Is connected: {'' + isConnected}</p>;
}

export default function Landing() {
    const authContext = useContext(AuthContext);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [info, setInfo] = useState('');

    const findMatch = () => {
        console.log(authContext.authSession); // tre sa trimit authsession mai jos ca sa verific access tokenul
        if (!authContext.authSession) {
            setInfo('Please login');
        } else {
            socket.emit('find-match', authContext.authSession);
            setInfo('Finding match...');
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
            console.log(data);
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, [socket]);

    return (
        <main>
            <h1>Chess</h1>
            <ConnectionState isConnected={isConnected} />
            {info && <p>{info}</p>}
            <button onClick={findMatch}>Find Match</button>
        </main>
    );
}