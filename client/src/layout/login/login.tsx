import { Link } from 'react-router-dom';
import './styles/login.css'
import { HeaderCard } from '../../components/header-card';
import { useLogInForm } from '../../utils/hooks/useLogInForm';

export default function LogIn() {
    const { fields, setters, state, actions } = useLogInForm();

    async function handleLogIn(e: React.SubmitEvent) {
        e.preventDefault();
        actions.submit();
    }

    return (
        <main>
            <HeaderCard title='Log In'>
                <form className='log-in-form' onSubmit={handleLogIn}>

                    <label htmlFor='email'>Email:</label>
                    <input
                        id='email'
                        value={fields.email}
                        onChange={(e) => setters.setEmail(e.target.value)}
                    />

                    <label htmlFor='password'>Password:</label>
                    <input
                        id='password'
                        value={fields.password}
                        type='password'
                        onChange={(e) => setters.setPassword(e.target.value)}
                    />
                    <button type='submit'>Log In</button>

                    {state.info && <p>{state.info}</p>}

                    <label>Don't have an account yet? <Link to='/signup'>Sign up</Link></label>
                </form>
            </HeaderCard>
        </main>
    );
}