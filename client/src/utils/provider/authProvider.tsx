import { useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import type { AuthSession } from "../interfaces/user";
import useFetchData from "../hooks/useFetchData";


export function AuthProvider({ children }: { children: React.ReactNode} ) {
    const [authSession, setAuthSession] = useState<AuthSession | null>(null);
    const fetched = useFetchData('http://localhost:3000/users/token', { credentials: 'include' })

    // i need to check if the request sent at /token contains the cookie with the refresh token
    useEffect(() => {
        if (fetched?.user && fetched?.accessToken) {
            setAuthSession(fetched);
        }
    }, [fetched]);

    return (
        <AuthContext value={{ authSession, setAuthSession }}>
            {children}
        </AuthContext>
    );
}