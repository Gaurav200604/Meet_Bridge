# MeetBridge

MeetBridge is a full-stack real-time video meeting application built with React, Vite, Node.js, Express, Socket.IO, and MongoDB.

It supports:
- User registration and login
- Protected routes for authenticated users
- Instant meeting creation and meeting join by code
- WebRTC-based peer-to-peer video/audio communication
- Real-time in-meeting chat with room message memory
- Meeting activity history per user

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Socket Events](#socket-events)
- [Authentication Flow](#authentication-flow)
- [Meeting History Flow](#meeting-history-flow)
- [Available Scripts](#available-scripts)
- [Build and Deployment](#build-and-deployment)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Material UI (MUI)
- Axios
- socket.io-client

### Backend
- Node.js
- Express
- Socket.IO
- Mongoose
- bcrypt
- dotenv

### Database
- MongoDB (Atlas/local)

## Project Structure

```text
video/
  backend/
    src/
      app.js
      controllers/
        socketManager.js
        user.controller.js
      models/
        meeting.model.js
        user.model.js
      routes/
        user.routes.js
  frontend/
    src/
      contexts/
        AuthContext.jsx
      pages/
        authentication.jsx
        history.jsx
        home.jsx
        landing.jsx
        VideoMeet.jsx
      styles/
        videoComponent.module.css
      App.jsx
      main.jsx
  package.json
```

## How It Works

1. User authenticates through register/login APIs.
2. Backend generates and stores a random token in the user document.
3. Frontend stores token in localStorage and uses AuthContext for protected routes.
4. On meeting create/join, frontend stores activity using backend API.
5. Meeting page connects to Socket.IO and joins a room based on URL path.
6. WebRTC signaling happens through Socket.IO signal events.
7. Chat messages are broadcast in room and stored in memory for current room lifecycle.
8. History page fetches user's meeting records using token.

## Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended
- MongoDB Atlas URI (or local MongoDB URI)

## Environment Variables

Create a file at backend/.env:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8001
```

Notes:
- If PORT is busy, backend automatically tries next ports.
- If MONGODB_URI is missing/unreachable, server can still start, but auth/history features that require DB will fail.

## Installation

From project root:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Running the App

### Option 1: Two terminals (recommended)

Terminal 1 (backend):

```bash
cd backend
npm start
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Then open the Vite local URL shown in terminal, usually:
- http://localhost:5173
- If busy, Vite may use 5174/5175

Backend default:
- http://localhost:8001

Health check:
- GET http://localhost:8001/health

## API Reference

Base URL:

```text
http://localhost:8001/api/v1/users
```

### 1) Register

- Method: POST
- Path: /register
- Body:

```json
{
  "name": "Gaurav",
  "username": "gaurav123",
  "password": "secret123"
}
```

- Success: 201 Created

```json
{
  "message": "User registered successfully"
}
```

### 2) Login

- Method: POST
- Path: /login
- Body:

```json
{
  "username": "gaurav123",
  "password": "secret123"
}
```

- Success: 200 OK

```json
{
  "token": "random_hex_token"
}
```

### 3) Add Meeting to Activity

- Method: POST
- Path: /add_to_activity
- Body:

```json
{
  "token": "random_hex_token",
  "meeting_code": "ABCD1234"
}
```

- Success: 201 Created

```json
{
  "message": "Meeting added to history",
  "meeting": {
    "_id": "...",
    "user_id": "gaurav123",
    "meetingCode": "ABCD1234",
    "date": "2026-05-07T..."
  }
}
```

### 4) Get All Activity

- Method: POST
- Path: /get_all_activity
- Body:

```json
{
  "token": "random_hex_token"
}
```

- Success: 200 OK

```json
[
  {
    "_id": "...",
    "user_id": "gaurav123",
    "meetingCode": "ABCD1234",
    "date": "2026-05-07T..."
  }
]
```

Important:
- get_all_activity uses POST (not GET).

## Socket Events

Server file: backend/src/controllers/socketManager.js

### Client -> Server
- join-call(path)
- signal(toId, message)
- chat-message(data, sender)

### Server -> Client
- user-join(newUserId, clients)
- signal(fromId, message)
- chat-message(data, sender, socketIdSender)
- user-left(socketId)

Room model:
- Room key is the meeting page path/URL from client side.

## Authentication Flow

- On successful login:
  - backend returns token
  - token stored in localStorage
  - AuthContext user state is set
  - user redirected to /home

- Protected routes:
  - /home
  - /history
  - /:url (meeting room)

- Logout:
  - token removed from localStorage
  - context user reset
  - redirect to /auth

## Meeting History Flow

1. User creates or joins meeting from Home.
2. Frontend calls add_to_activity with token + meeting code.
3. History page calls get_all_activity with token.
4. Meetings are listed in reverse chronological order.
5. User can rejoin a meeting directly from history.

## Available Scripts

### Root
- npm install

### Backend
- npm run dev (nodemon)
- npm start (node src/app.js)

### Frontend
- npm run dev
- npm run build
- npm run preview
- npm run lint

## Build and Deployment

Frontend production build:

```bash
cd frontend
npm run build
```

Generated files:
- frontend/dist/

Backend deployment requirements:
- NODE environment with access to MongoDB
- PORT and MONGODB_URI configured
- CORS origins updated for deployed frontend domain

## Troubleshooting

### 1) CORS errors in browser
- Ensure frontend origin is included in backend CORS list in app.js.
- Common local origins already included: 5173, 5174, 5175.

### 2) Port already in use
- Backend tries next ports automatically.
- Frontend Vite also moves to next free port.

### 3) Login works but history fails
- Confirm token exists in localStorage.
- Confirm get_all_activity request is POST with token in body.
- Confirm MongoDB connection is healthy.

### 4) Git line-ending warning (LF/CRLF)
- This is common on Windows and usually harmless.
- It does not affect runtime behavior.

### 5) "Bad escaped character in JSON"
- Request body is malformed JSON.
- Recheck payload formatting in API clients.

### 6) Socket not connecting
- Ensure backend is running.
- Verify frontend socket URL points to current backend port.
- Check browser console and backend terminal logs.

## Future Improvements

- Replace token-in-user-document approach with JWT and expiration.
- Add refresh token flow.
- Persist chat history in database per meeting.
- Add participant names and avatars in video tiles.
- Add meeting scheduling and calendar integration.
- Add unit/integration tests for backend routes and frontend pages.
- Add Docker and CI/CD workflows.

---

If you want, I can also generate:
- a shorter recruiter-friendly README version
- API-only docs in OpenAPI format
- setup docs for Windows + Linux separately
