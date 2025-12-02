/**
 * Smoke test: connect to backend, create a room and assert room:created and room:list
 */
const ioClient = require('socket.io-client')

const URL = process.env.WS_URL || 'http://localhost:3001'

async function run() {
  console.log('Connecting to', URL)
  const socket = ioClient(URL, { autoConnect: true })

  socket.on('connect', () => {
    console.log('connected', socket.id)
    // request room list
    socket.emit('room:list')
  })

  socket.on('room:list', (list) => {
    console.log('room:list received, count=', (list && list.length) || 0)
    // create a new room
    socket.emit('room:create', { name: 'Smoke Room', nickname: 'Tester' })
  })

  socket.on('room:created', (payload) => {
    console.log('room:created', payload)
    if (!payload || !payload.room || !payload.room.id) {
      console.error('Invalid room created payload')
      process.exitCode = 2
      socket.close()
      return
    }
    console.log('Smoke test succeeded: room created id=', payload.room.id)
    socket.close()
  })

  socket.on('error', (err) => {
    console.error('server error', err)
    socket.close()
    process.exitCode = 3
  })

  socket.on('connect_error', (err) => {
    console.error('connect_error', err.message)
    process.exitCode = 4
    socket.close()
  })
}

run().catch((err) => {
  console.error('smoke test failed', err)
  process.exitCode = 1
})
