import { createContext } from "react";
import type { AuthSession } from "../interfaces/user";

interface AuthContextType {
    authSession: AuthSession | null,
    setAuthSession: (authSession: AuthSession | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    authSession: null,
    setAuthSession: () => {}
});
