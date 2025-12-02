/**
GitHub Copilot Prompt:
Create an Express server that:
- Loads dotenv and reads PORT, CORS_ORIGIN (defaults: 3001, http://localhost:5173)
- Enables JSON and CORS (only the specified origin)
- Adds GET /api/health route (from routes/health.js)
- Creates an HTTP server and attaches a Socket.io server (from socket/io.js)
- Starts listening and logs URLs for HTTP and WebSocket
Export the httpServer for testing (optional).
*/
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const express = require('express')
const http = require('http')
const cors = require('cors')

const healthRouter = require('./routes/health')
const { createSocketServer } = require('./socket/io')

const PORT = process.env.PORT || 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

const app = express()
app.use(express.json())
app.use(cors({ origin: CORS_ORIGIN }))

app.use(healthRouter)

const httpServer = http.createServer(app)

// attach socket server
const io = createSocketServer(httpServer, CORS_ORIGIN)

httpServer.listen(PORT, () => {
	console.log(`HTTP server listening: http://localhost:${PORT}`)
	console.log(`Socket.io listening (same server)`)
})

module.exports = { httpServer, io }
