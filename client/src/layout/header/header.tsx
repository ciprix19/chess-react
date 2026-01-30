import './styles/header.css'
import '../../styles/variables.css'
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../utils/context/authContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const authContext = useContext(AuthContext);

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    async function handleLogout() {
        const response = await fetch('http://localhost:3000/users/logout', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            }
        });
        if (response.status === 204) authContext.setAuthSession(null);
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
                    <li onClick={authContext.authSession !== null ? handleLogout : () => {}}>
                        {authContext.authSession !== null ?
                            <a>Logout</a> :
                            <Link to='/login'>Login</Link>
                        }
                    </li>
                </ul>
            </nav>
        </header>
    );
}