
export type User = {
    id: number;
    email: string;
}

export type AuthSession = {
    user: User;
    accessToken: string;
}

export type UserPlayer = {
    user: User | undefined;
    score: number;
    color: string;
}
