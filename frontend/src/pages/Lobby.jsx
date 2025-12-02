/**
GitHub Copilot Prompt:
Build a Lobby page that:
- Connects the socket on mount; disconnects on unmount
- Shows a list of rooms (id, name, userCount) via "room:list"
- Lets user set a nickname (NicknamePrompt component)
- Allows creating a room (RoomList component includes a create form)
- Allows joining a selected room -> navigate to /room/:roomId with nickname in state
- Handles loading/empty/error states and a manual "Refresh" button that re-requests room list
Use React hooks and minimal styling.
*/
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NicknamePrompt from '../components/NicknamePrompt'
import RoomList from '../components/RoomList'
import { socket, connect, disconnect, emitRoomList, onRoomList, createRoom, joinRoom } from '../services/socket'

export default function Lobby() {
	const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '')
	const [rooms, setRooms] = useState([])
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		connect()
		const off = onRoomList((list) => {
			setRooms(list || [])
			setLoading(false)
		})
		emitRoomList()
		return () => {
			off()
			disconnect()
		}
	}, [])

	useEffect(() => {
		localStorage.setItem('nickname', nickname)
	}, [nickname])

	function handleCreate(name) {
		if (!nickname) return alert('Set a nickname first')
		createRoom({ name, nickname })
	}

	function handleJoin(roomId) {
		if (!nickname) return alert('Set a nickname first')
		// navigate to chat room, pass nickname in state
		navigate(`/room/${roomId}`, { state: { nickname } })
	}

	return (
		<div>
			<section style={{ marginBottom: 12 }}>
				<h2>Enter a nickname</h2>
				<NicknamePrompt value={nickname} onChange={setNickname} onSubmit={() => {}} />
			</section>

			<section>
				<h2>Public Rooms</h2>
				<RoomList rooms={rooms} onCreate={handleCreate} onJoin={handleJoin} />
				{loading && <div>Loading rooms…</div>}
			</section>
		</div>
	)
}
