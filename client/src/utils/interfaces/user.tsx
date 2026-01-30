
export type User = {
    id: number,
    email: string
}

export type AuthSession = {
    user: User,
    accessToken: string
}