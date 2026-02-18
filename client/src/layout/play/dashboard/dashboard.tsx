import { useState } from 'react';
import type { GamePhase } from '../../../utils/interfaces/chess-types';
import './styles/dashboard.css';
import ModalButton from './modal-button';

function DrawPanel({ handleDrawAccepted } : { handleDrawAccepted: (answer: boolean) => void }) {
    return (
        <>
            <h3>Accept Draw?</h3>
            <button onClick={() => handleDrawAccepted(true)}>Yes</button>
            <button onClick={() => handleDrawAccepted(false)}>No</button>
        </>
    );
}

export default function Dashboard({ info, drawOfferReceived, handleDrawAccepted, gamePhase, handleFindMatch, handleRematch, handleDraw, handleResign } : {
    info: string,
    drawOfferReceived: boolean,
    handleDrawAccepted: (answer: boolean) => void,
    gamePhase: GamePhase,
    handleFindMatch: () => void,
    handleRematch: () => void,
    handleDraw: () => void,
    handleResign: () => void
}) {

    return (
        <div className='dashboard'>
            {drawOfferReceived && <DrawPanel handleDrawAccepted={handleDrawAccepted}/>}
            {info && <h3>{info}</h3>}
            <h3>Move history</h3>
            <textarea className='move-history'>

            </textarea>
            <div className='options'>
                {(gamePhase === 'playing' || gamePhase === 'check') &&
                    <>
                        {/* <button onClick={toggleModal}>Resign</button> */}
                        <ModalButton action='resign' onYesAction={handleResign}/>
                        <ModalButton action='draw' onYesAction={handleDraw}/>
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
