import './styles/header.css'
import '../../styles/variables.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header>
            <Link to='/'>
                <img className='logo' alt='logo' src='images/logo.svg' onClick={() => {
                    if (isMenuOpen) toggleMenu();
                }}/>
            </Link>
            <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <span className='bar'></span>
                <span className='bar'></span>
                <span className='bar'></span>
            </button>
            <nav className='primary-navigation'>
                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li onClick={toggleMenu}>
                        <Link to='/play'>Play</Link>
                    </li>
                    <li onClick={toggleMenu}>
                        <Link to='/login'>Log In</Link>
                    </li>
                    <li onClick={toggleMenu}>
                        <Link to='/signup'>Sign Up</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}