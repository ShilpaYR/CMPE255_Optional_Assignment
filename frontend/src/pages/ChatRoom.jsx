/**
GitHub Copilot Prompt:
Build a ChatRoom page that:
- Reads :roomId param and optional nickname from location state; if missing, prompt for nickname
- Connects socket (if not already), join room via "room:join"
- Renders:
  - room header with name, user count, leave/back button
  - MessageList for messages
  - TypingIndicator for who is typing
  - MessageInput to send new messages and typing events
- Subscribes to:
  - "room:state" for initial messages and metadata
  - "message:new" to append messages
  - "message:typing" to update typing users (map by socketId)
  - "room:user-joined" / "room:user-left" to show system toasts or inline notices
- Handles disconnects gracefully; provide a retry or back link.
*/
import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import NicknamePrompt from '../components/NicknamePrompt'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import TypingIndicator from '../components/TypingIndicator'
import { connect, disconnect, joinRoom, onEvent, sendMessage, sendTyping } from '../services/socket'

export default function ChatRoom() {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [nickname, setNickname] = useState((location.state && location.state.nickname) || '')
  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [typingMap, setTypingMap] = useState({})

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [])

  useEffect(() => {
    if (!nickname) return
    joinRoom({ roomId, nickname })

  const offState = onEvent('room:state', (payload) => {
      setRoom({ id: payload.id, name: payload.name, userCount: payload.userCount })
      setMessages(payload.messages || [])
    })

  const offMsg = onEvent('message:new', (msg) => setMessages((s) => [...s, msg]))
  const offTyping = onEvent('message:typing', ({ socketId, nickname, typing }) => {
      setTypingMap((m) => ({ ...m, [socketId]: { nickname, typing } }))
    })
  const offJoin = onEvent('room:user-joined', ({ socketId, nickname }) => {
      setMessages((s) => [...s, { id: `sys-${Date.now()}`, system: true, text: `${nickname} joined`, ts: Date.now() }])
    })
  const offLeft = onEvent('room:user-left', ({ socketId, nickname }) => {
      setMessages((s) => [...s, { id: `sys-${Date.now()}`, system: true, text: `${nickname} left`, ts: Date.now() }])
    })

    return () => {
      offState()
      offMsg()
      offTyping()
      offJoin()
      offLeft()
    }
  }, [nickname, roomId])

  function handleSend(text) {
    sendMessage({ roomId, text })
  }

  function handleTyping(isTyping) {
    sendTyping({ roomId, typing: isTyping })
  }

  if (!nickname) {
    return (
      <div>
        <h2>Pick a nickname to join room</h2>
        <NicknamePrompt value={nickname} onChange={setNickname} onSubmit={() => {}} />
        <div style={{ marginTop: 8 }}>
          <button onClick={() => navigate('/')}>Back to lobby</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{room ? room.name : `Room ${roomId}`}</h2>
        <div>
          <button onClick={() => navigate('/')}>Leave</button>
        </div>
      </div>

      <MessageList messages={messages} />
      <TypingIndicator typingMap={typingMap} />
      <MessageInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  )
}
