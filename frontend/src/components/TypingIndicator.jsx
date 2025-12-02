/**
GitHub Copilot Prompt:
Create a TypingIndicator component:
Props:
- typingMap: Map<string, { nickname: string, typing: boolean }>
Behavior:
- Show a compact line like: "Alice and 2 others are typing..." or "Bob is typing..."
- Hide if none typing
Export default.
*/
import React from 'react'

export default function TypingIndicator({ typingMap = {} }) {
	const typingUsers = Object.values(typingMap).filter((t) => t && t.typing).map((t) => t.nickname)
	if (typingUsers.length === 0) return null
	if (typingUsers.length === 1) return <div style={{ color: '#666', fontSize: 13 }}>{typingUsers[0]} is typing…</div>
	return <div style={{ color: '#666', fontSize: 13 }}>{typingUsers[0]} and {typingUsers.length - 1} others are typing…</div>
}
