const { Server } = require('socket.io')
const { sanitizeRoomName, sanitizeNickname, sanitizeMessage } = require('../utils/validators')

/**
 * Create and wire a Socket.io server for rooms-based chat.
 * @param {http.Server} httpServer
 * @param {string} corsOrigin
 */
function createSocketServer(httpServer, corsOrigin) {
  const corsOpt = process.env.NODE_ENV === 'production' ? { origin: corsOrigin } : { origin: true }
  const io = new Server(httpServer, {
    cors: corsOpt,
  })

  // in-memory rooms state
  const rooms = {}

  function makeId() {
    return Math.random().toString(36).slice(2, 9)
  }

  function getRoomList() {
    return Object.keys(rooms).map((id) => {
      const r = rooms[id]
      const lastMsg = r.messages.length ? r.messages[r.messages.length - 1].ts : null
      return { id, name: r.name, userCount: r.users.size, lastMessageAt: lastMsg }
    })
  }

  function broadcastRoomList() {
    try {
      io.emit('room:list', getRoomList())
    } catch (err) {
      console.error('broadcastRoomList error', err)
    }
  }

  io.on('connection', (socket) => {
    socket.data = socket.data || {}

    // helper: safely emit error
    function emitError(message) {
      socket.emit('error', { message })
    }

    // list request
    socket.on('room:list', () => {
      socket.emit('room:list', getRoomList())
    })

    socket.on('room:create', ({ name, nickname } = {}) => {
      try {
        const sName = sanitizeRoomName(name)
        const sNick = sanitizeNickname(nickname)
        if (!sName) return emitError('Invalid room name')
        if (!sNick) return emitError('Invalid nickname')

        const roomId = makeId()
        rooms[roomId] = {
          name: sName,
          users: new Map(),
          messages: [],
        }

        // auto-join
        socket.join(roomId)
        socket.data.roomId = roomId
        socket.data.nickname = sNick
        rooms[roomId].users.set(socket.id, { nickname: sNick })

        const roomMeta = { id: roomId, name: sName, userCount: rooms[roomId].users.size }
        socket.emit('room:created', { room: roomMeta })
        socket.to(roomId).emit('room:user-joined', { socketId: socket.id, nickname: sNick })
        broadcastRoomList()
      } catch (err) {
        console.error('room:create error', err)
        emitError('Could not create room')
      }
    })

    socket.on('room:join', ({ roomId, nickname } = {}) => {
      try {
        const sNick = sanitizeNickname(nickname)
        if (!sNick) return emitError('Invalid nickname')
        if (!roomId || !rooms[roomId]) return emitError('Room not found')

        socket.join(roomId)
        socket.data.roomId = roomId
        socket.data.nickname = sNick
        rooms[roomId].users.set(socket.id, { nickname: sNick })

        // send room state
        const room = rooms[roomId]
        const recent = room.messages.slice(-50)
        socket.emit('room:state', { id: roomId, name: room.name, userCount: room.users.size, messages: recent })

        socket.to(roomId).emit('room:user-joined', { socketId: socket.id, nickname: sNick })
        broadcastRoomList()
      } catch (err) {
        console.error('room:join error', err)
        emitError('Could not join room')
      }
    })

    socket.on('message:send', ({ roomId, text } = {}) => {
      try {
        const sText = sanitizeMessage(text)
        if (!sText) return emitError('Invalid message')
        const rId = roomId || socket.data.roomId
        if (!rId || !rooms[rId]) return emitError('Room not found')
        const nickname = socket.data.nickname || 'Anonymous'
        const msg = { id: makeId(), nickname, text: sText, ts: Date.now() }
        rooms[rId].messages.push(msg)
        // cap history
        if (rooms[rId].messages.length > 500) rooms[rId].messages.shift()
        io.to(rId).emit('message:new', msg)
      } catch (err) {
        console.error('message:send error', err)
        emitError('Could not send message')
      }
    })

    socket.on('message:typing', ({ roomId, typing } = {}) => {
      try {
        const rId = roomId || socket.data.roomId
        if (!rId || !rooms[rId]) return
        const nickname = socket.data.nickname || 'Anonymous'
        socket.to(rId).emit('message:typing', { socketId: socket.id, nickname, typing: !!typing })
      } catch (err) {
        console.error('message:typing error', err)
      }
    })

    socket.on('disconnect', (reason) => {
      try {
        const rId = socket.data.roomId
        const nick = socket.data.nickname
        if (rId && rooms[rId]) {
          rooms[rId].users.delete(socket.id)
          socket.to(rId).emit('room:user-left', { socketId: socket.id, nickname: nick })
          broadcastRoomList()
        }
      } catch (err) {
        console.error('disconnect cleanup error', err)
      }
    })

    // initial push of room list to the new client
    socket.emit('room:list', getRoomList())
  })

  return io
}

module.exports = { createSocketServer }
/**
GitHub Copilot Prompt:
Initialize and manage Socket.io for a rooms-based chat.

Requirements:
- Export a function createSocketServer(httpServer, corsOrigin) that creates new Server({ cors: { origin: corsOrigin } })
- Maintain in-memory state:
  rooms: {
    [roomId]: {
      name: string,
      users: Map<socketId, { nickname: string }>,
      messages: Array<{ id: string, nickname: string, text: string, ts: number }>
    }
  }
- Generate roomId (short id) on create; store room name.
- Socket event handlers:
  1) "room:list" -> emit current list: [{id, name, userCount, lastMessageAt}]
  2) "room:create" { name, nickname } -> validate; create room; auto-join; emit "room:created" with {room}
  3) "room:join" { roomId, nickname } -> validate; join socket to room; notify others ("room:user-joined")
     - Send back "room:state" with room meta and recent messages (last 50)
  4) "message:send" { roomId, text } -> validate; push to messages; emit "message:new" to room
  5) "message:typing" { roomId, typing } -> broadcast "message:typing" with { socketId, nickname, typing }
  6) On disconnect -> if in a room, remove user; if room empty keep room; broadcast "room:user-left"
- Periodically (e.g., on create/join/leave) broadcast "room:list" updates to all clients.
- Keep code well structured and resilient; catch errors and emit "error" with human-readable message.
- Use helper validators from utils/validators.js.
*/
