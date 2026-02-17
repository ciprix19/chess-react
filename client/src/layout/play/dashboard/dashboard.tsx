import type { GamePhase, MatchType } from '../../../utils/interfaces/chess-types';
import './styles/dashboard.css'

export default function Dashboard({ info, gamePhase, handleFindMatch, handleRematch, handleDraw, handleResign } : {
    info: string,
    gamePhase: GamePhase,
    handleFindMatch: () => void,
    handleRematch: () => void,
    handleDraw: () => void,
    handleResign: () => void
}) {
    return (
        <div className='dashboard'>
            <h3>Move history</h3>
            <textarea className='move-history'>

            </textarea>
            <div className='options'>
                {(gamePhase === 'playing' || gamePhase === 'check') &&
                    <>
                        <button onClick={handleResign}>Resign</button>
                        <button onClick={handleDraw}>Draw</button>
                    </>}
                {gamePhase === 'gameover' &&
                    <>
                        <button onClick={handleRematch}>Rematch</button>
                        <button onClick={handleFindMatch}>Find Match</button>
                    </>}
                <button className='previous-move'>
                    <img src='/images/icons/up-chevron.svg' alt='previous-move'/>
                </button>
                <button className='next-move'>
                    <img src='/images/icons/up-chevron.svg' alt='next-move'/>
                </button>
            </div>
        </div>
    );
}
