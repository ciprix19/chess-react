import { useState } from "react";


export function useSignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [info, setInfo] = useState('');

    function reset() {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    async function submit() {
        const response = await fetch('http://localhost:3000/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })
        });
        const data = await response.json();
        setInfo(data.message);
    }

    return {
        fields: {
            email,
            password,
            confirmPassword
        },
        setters: {
            setEmail,
            setPassword,
            setConfirmPassword
        },
        state: {
            info
        },
        actions: {
            submit
        }
    }
}
