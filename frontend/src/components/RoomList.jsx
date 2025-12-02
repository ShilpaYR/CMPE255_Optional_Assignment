/**
GitHub Copilot Prompt:
Create a RoomList component:
Props:
- rooms: [{id, name, userCount}]
- onCreate(name: string)
- onJoin(roomId: string)
UI:
- List rooms with name and userCount
- Create room form (input + button)
- Buttons to join room
- Handle no rooms case with a friendly message
Export default.
*/
import React, { useState } from 'react'

export default function RoomList({ rooms = [], onCreate, onJoin }) {
	const [name, setName] = useState('')

	function submit(e) {
		e.preventDefault()
		if (!name.trim()) return
		onCreate(name.trim())
		setName('')
	}

	return (
		<div>
			<form onSubmit={submit} style={{ marginBottom: 12 }}>
				<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Create room" />
				<button type="submit">Create</button>
			</form>

			{rooms.length === 0 ? (
				<div>No public rooms yet. Create one above.</div>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{rooms.map((r) => (
						<li key={r.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
							<div>
								<strong>{r.name}</strong>
								<div style={{ fontSize: 12, color: '#666' }}>{r.userCount} online</div>
							</div>
							<div>
								<button onClick={() => onJoin(r.id)}>Join</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
