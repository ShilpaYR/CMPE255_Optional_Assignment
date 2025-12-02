/**
GitHub Copilot Prompt:
Create a socket service using socket.io-client.

Requirements:
- Read VITE_WS_URL
- Export a singleton `socket` connected to the server with autoConnect: false
- Export helper functions to:
  - connect() and disconnect()
  - emitRoomList(), onRoomList(cb)
  - createRoom({ name, nickname })
  - joinRoom({ roomId, nickname })
  - sendMessage({ roomId, text })
  - sendTyping({ roomId, typing })
- Provide on/off helpers for:
  - "room:created", "room:state", "message:new", "message:typing", "room:user-joined", "room:user-left", "error"
- Ensure listeners can be cleaned up.
*/
import { io as ioClient } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001'

const socket = ioClient(WS_URL, { autoConnect: false })

function connect() {
  if (!socket.connected) socket.connect()
}

function disconnect() {
  if (socket.connected) socket.disconnect()
}

function emitRoomList() {
  socket.emit('room:list')
}

function onRoomList(cb) {
  socket.on('room:list', cb)
  return () => socket.off('room:list', cb)
}

function createRoom({ name, nickname }) {
  socket.emit('room:create', { name, nickname })
}

function joinRoom({ roomId, nickname }) {
  socket.emit('room:join', { roomId, nickname })
}

function sendMessage({ roomId, text }) {
  socket.emit('message:send', { roomId, text })
}

function sendTyping({ roomId, typing }) {
  socket.emit('message:typing', { roomId, typing })
}

const onEvent = (event, cb) => {
  socket.on(event, cb)
  return () => socket.off(event, cb)
}

const offEvent = (event, cb) => socket.off(event, cb)

export {
  socket,
  connect,
  disconnect,
  emitRoomList,
  onRoomList,
  createRoom,
  joinRoom,
  sendMessage,
  sendTyping,
  onEvent,
  offEvent,
}

