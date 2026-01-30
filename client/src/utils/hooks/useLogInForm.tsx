import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export function useLogInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    function reset() {
        setEmail('');
        setPassword('');
    }

    async function submit() {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await response.json();
        if (response.status !== 200) setInfo(data.message);
        else {
            authContext.setAuthSession(data);
            navigate('/');
        }
    }

    return {
        fields: {
            email,
            password
        },
        setters: {
            setEmail,
            setPassword
        },
        state: {
            info
        },
        actions: {
            submit
        }
    }
}
