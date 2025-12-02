Youtube Link Assignment 1:https://youtu.be/Pv7lnIIhpPQ?si=wUwfuqnZH4OSbrk8
Youtube Link Assignment 2:https://youtu.be/3jrL8hSebu8?si=4m2lyrpdhouX03eJ

# Use GitHub Copilot Prompt to build a realtime chat app.
- Backend: Node.js + Express + Socket.io (port 3001), CORS for http://localhost:5173
- Frontend: React (Vite) + React Router (port 5173)
Features:
- Lobby with public room list and create/join
- Nicknames
- Per-room chat with message history (in-memory), typing indicators, user join/leave events
- Online user count per room
Include:
- Setup and run instructions (two terminals)
- .env variables for backend and frontend
- Event protocol docs (socket events: room:list, room:create, room:join, message:send, message:typing, etc.)
- Troubleshooting tips (CORS, socket URL)
- Proof of Copilot usage section
This repository contains a small Realtime Chat (Rooms) app with a Node/Express + Socket.io backend and a React (Vite) frontend.

## What Github Copilot built
- Backend: Node.js + Express + Socket.io handling rooms, nicknames, per-room message history (in-memory), typing indicators, and user join/leave events.
- Frontend: React + Vite + React Router (basic client-side structure). A socket service is provided to connect to the backend.

Features:
- Lobby with public room list and create/join
- Nicknames
- Per-room chat with in-memory message history (last ~500 kept, last 50 sent on join)
- Typing indicators and user join/leave events
- Online user count per room

## Files changed / created
- `backend/src/socket/io.js` — Socket.io server implementation (rooms, messages, typing)
- `backend/src/index.js` — Express server and socket wiring
- `backend/src/utils/validators.js` — input sanitizers for room, nickname and messages
- `backend/src/routes/health.js` — basic health endpoint
- `backend/test/smoke-room.js` — smoke test script that validates room creation
- `frontend/src/services/socket.js` — socket client service (used by frontend components)
- package.json files for both backend and frontend

## Setup (two terminals)

1) Backend

Install dependencies and start the backend:

```bash
cd backend
npm install
npm start
```

By default the backend listens on port 3001. You can set environment variables in `backend/.env` or your shell:

- PORT (default 3001)
- CORS_ORIGIN (default `http://localhost:5173`)

2) Frontend

Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on port 5173 by default. If using the default, the backend CORS is already set to allow that origin.

## Environment variables

Backend (`backend/.env` or env):

- PORT=3001
- CORS_ORIGIN=http://localhost:5173

Frontend (`frontend/.env` for Vite):

- VITE_WS_URL=http://localhost:3001

If `VITE_WS_URL` is not set, the frontend socket service will default to `http://localhost:3001`.

## Socket event protocol

Client emits:
- `room:list` -> ask for list of rooms
- `room:create` { name, nickname } -> create a room and auto-join
- `room:join` { roomId, nickname } -> join an existing room
- `message:send` { roomId?, text } -> send a message to a room (roomId optional if already joined)
- `message:typing` { roomId?, typing } -> send typing state

Server emits:
- `room:list` [{id, name, userCount, lastMessageAt}] -> current room list
- `room:created` { room } -> ack that a room was created
- `room:state` { id, name, userCount, messages } -> sent when joining a room
- `message:new` { id, nickname, text, ts } -> new message in room
- `message:typing` { socketId, nickname, typing } -> someone is typing
- `room:user-joined` { socketId, nickname } -> user joined
- `room:user-left` { socketId, nickname } -> user left
- `error` { message } -> human-readable error

All events are plain JSON objects.

## Smoke test (verify room creation)

After starting the backend, run the smoke script to validate room creation:

```bash
cd backend
npm run smoke
```

This script connects using a socket client, requests the room list, creates a room called "Smoke Room", and verifies the `room:created` event is received.

## Troubleshooting

- CORS issues: Ensure `CORS_ORIGIN` on the backend matches the origin where Vite serves the frontend (`http://localhost:5173`).
- Wrong socket URL: Set `VITE_WS_URL` in `frontend/.env` if your backend runs on a different host/port.
- Port already in use: change `PORT` or the frontend port (Vite) in your environment.

## Proof of Copilot usage

This README and many code files were scaffolded and implemented with Copilot-style prompts embedded in the repository. The prompts guided building the socket server, validators, and client service. Small utility and test files were added to demonstrate and validate the core features.

## Next steps / improvements

- Persist rooms and messages in a database (Redis, Postgres) for durability
- Add authentication and per-user profiles
- Add tests for the frontend UI (e.g., Playwright)
- Limit room creation rate and add moderation controls

