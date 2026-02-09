import { Link } from 'react-router-dom';
import './styles/signup.css'
import { useSignUpForm } from '../../utils/hooks/useSignUpForm';
import { HeaderCard } from '../../components/header-card';

export default function SignUp() {
    const { fields, setters, state, actions } = useSignUpForm();

    async function handleSignUp(e: React.SubmitEvent) {
        e.preventDefault();
        actions.submit();
    }

    return (
        <main>
            <HeaderCard title='Sign Up'>
                <form className='sign-up-form' onSubmit={handleSignUp}>

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

                    <label htmlFor='confirm-password'>Confirm Password:</label>
                    <input
                        id='confirm-password'
                        value={fields.confirmPassword}
                        type='password'
                        onChange={(e) => setters.setConfirmPassword(e.target.value)}
                    />
                    <button type='submit'>Sign Up</button>

                    {state.info && <p>{state.info}</p>}

                    <p>Already have an account?<Link to='/login'>Log in</Link></p>
                </form>
            </HeaderCard>
        </main>
    );
}