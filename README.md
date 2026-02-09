# Real-Time Multiplayer Chess Platform

A real-time multiplayer chess application with authoritative server-side game logic, secure authentication, and live move synchronization. Built using React + Express.js

## Features:

- Real-time multiplayer gameplay using WebSockets (Socket.IO)
- Authoritative server-side chess engine (prevents client-side cheating)
- Full chess ruleset:
  - Legal move generation
  - Turn enforcement
  - Check, checkmate, and stalemate detection (currently in development)
- Play only using an account, which uses secure authentication with JWT access & http-only cookies refresh tokens
- Matchmaking system for pairing players, enabling multiple games to be handled by the server
- Interactive frontend with:
  - Piece selection
  - Legal move highlighting
  - Live board updates
  - Turn-based UI feedback

## Architecture Overview:

- The server is the single source of truth for the:
  - game state
  - legal moves
  - turn validation
  - match state (playing, check, checkmate, stalemate)
- The client is responsible only for:
  - rendering the board
  - handling user interaction
  - sending move intetions to the server

## App flow:

1. Player joins matchmaking
2. If player is found, the server creates a match and randomly assigns colors
3. The server sends the initial board, the game details (players, the color assigned to each player, the legal moves that the player can make)
4. The client sends move requests
5. The server validates and applies the moves
6. The server then broadcasts the updated state (including legal moves) to both players

## Technologies used:

### Frontend

- React
- Typescript
- Socket.IO Client

### Backend
- Node.js / Express.js
- Socket.IO Server
- JWT Authentication (access + refresh tokens using http-only cookies)

## Authentication

- JWT-based authentication
- Access tokens for API and socket connections
- refresh tokens for session persistence (keep login session active for a set time)
- socket connections are authenticated server-side (using auth middleware function in Express.js)

## Game State Management

Each match maintains a centralized state including:
- Chess board matrix
- Active turn (`white` / `black`)
- Legal moves per player
- Game status (`playing`, `check`, `checkmate`, `stalemate`)
- Match participants and assigned colors

This ensures consistency and prevents invalid or malicious moves.

## Installation & Setup

### install dependencies
npm install

### start backend
npm run server

### start frontend
npm run client