import { useMemo } from 'react';
import type { CapturesType, UserPlayer } from '../../../utils/interfaces/chess-types';
import './styles/player-area.css'
import Timer from '../timer/timer';

function CapturesPanel({ player, captures } : { player: UserPlayer, captures: CapturesType }) {
    const sortedCaptures = useMemo(() => {
        return [...captures[player.color]].sort((piece1, piece2) => piece1.value - piece2.value);
    }, [captures, player.color]);

    return (
        <div className='captures-panel'>
            <div className='captured-pieces'>
                {sortedCaptures.map(piece =>
                    <img key={piece.id} src={`./images/piecesv2/${piece.type}-${piece.color}.svg`} alt='' />
                )}
            </div>
            <p>{player?.score > 0 ? `+${player.score}` : ''}</p>
        </div>
    );
}

function PlayerInfo({ player, captures } : { player: UserPlayer, captures: CapturesType }) {
    return (
        <div className='player-panel'>
            <p>{player.user?.email}</p>
            <CapturesPanel player={player} captures={captures}/>
        </div>
    );
}

function PlayerPanel({ player, captures} : { player: UserPlayer, captures: CapturesType }) {
    return (
        <div>
            <img className='profile-img' src='/images/profile-pic.jpg' alt='profile-pic'/>
            <PlayerInfo player={player} captures={captures}/>
        </div>
    );
}

export function PlayerArea({ player, captures, timerValueInMinutes } : { player: UserPlayer, captures: CapturesType, timerValueInMinutes: number }) {
    return (
        <div className='player-area'>
            <PlayerPanel player={player} captures={captures}/>
            <Timer timerValueInMinutes={timerValueInMinutes}/>
        </div>
    );
}
