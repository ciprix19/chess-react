import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';

export const socket = io(URL, {
    auth: {
        token: null
    },
    autoConnect: false
});

// export function createSocket(accessToken: string) {
//     return io(URL, {
//         auth: {
//             token: accessToken
//         },
//         autoConnect: false
//     })
// }
