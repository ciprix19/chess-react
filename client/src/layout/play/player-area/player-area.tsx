import './styles/player-area.css'

type PlayerAreaType = {
    score: number,
    username: string,
    // rating: string
}

export default function PlayerArea({ score, username } : PlayerAreaType) {
    return (
        <div className='player-area'>
            <h3>{score}</h3>
            <h3>{username}</h3>
            <div>clock</div>
        </div>
    );
}
