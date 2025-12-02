/**
GitHub Copilot Prompt:
Create a MessageList component:
Props:
- messages: Array<{ id, nickname, text, ts, system?: boolean }>
Behavior:
- Render messages chronologically with timestamp HH:mm
- Different style for system vs user messages
- Auto-scroll to bottom on new message
Export default.
*/
import React, { useEffect, useRef } from 'react'

function fmt(ts) {
	try {
		const d = new Date(ts)
		return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	} catch {
		return ''
	}
}

export default function MessageList({ messages = [] }) {
	const ref = useRef()

	useEffect(() => {
		if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
	}, [messages])

	return (
		<div ref={ref} style={{ height: 300, overflow: 'auto', border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
			{messages.map((m) => (
				<div key={m.id} style={{ marginBottom: 8, color: m.system ? '#666' : '#000' }}>
					{m.system ? (
						<div style={{ textAlign: 'center', fontSize: 12 }}>{m.text} <span style={{ color: '#999' }}>{fmt(m.ts)}</span></div>
					) : (
						<div>
							<div style={{ fontSize: 12, color: '#333' }}><strong>{m.nickname}</strong> <span style={{ color: '#999' }}>{fmt(m.ts)}</span></div>
							<div>{m.text}</div>
						</div>
					)}
				</div>
			))}
		</div>
	)
}
