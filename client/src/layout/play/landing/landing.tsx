import './styles/landing.css'

export default function Landing({ info, handleFindMatch } : { info: string, handleFindMatch: () => void }) {
    return (
        <div className='landing'>
            <h1>Real Time Multiplayer Chess App</h1>
            <div className='two-column-layout'>
                <div>
                    <h2>How to play:</h2>
                    <ul>
                        <li>Click 'Find Match'</li>
                        <li>Enjoy!</li>
                    </ul>
                    <h3>Features:</h3>
                    <ul>
                        <li>Real time game communication between players</li>
                        <li>Works across different browser sessions</li>
                        <li>Server is the source of truth and validates moves</li>
                        <li>Legal move highlight</li>
                        <li>Implemented castling, en passant, checkmate, stalemate, promotion</li>
                        <li>Timer</li>
                    </ul>
                </div>
                <div>
                    <p>{info}</p>
                    <button onClick={handleFindMatch}>Find Match</button>
                </div>
            </div>
        </div>
    );
}
