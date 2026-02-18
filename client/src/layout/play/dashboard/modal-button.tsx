import { useState } from 'react'
import './styles/modal-button.css'

type ActionType = 'resign' | 'draw';

export default function ModalButton({ action, onYesAction } : { action: ActionType, onYesAction: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className='modal-button'>
            <button onClick={toggleIsOpen}>{action.charAt(0).toUpperCase() + action.slice(1)}</button>
            <div className={`modal ${isOpen ? 'active' : ''}`}>
                <p>{action.charAt(0).toUpperCase() + action.slice(1)}?</p>
                <div className='button-options'>
                    <button onClick={onYesAction}>Yes</button>
                    <button onClick={() => setIsOpen(false)}>No</button>
                </div>
            </div>
        </div>
    );
}
