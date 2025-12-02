/**
GitHub Copilot Prompt:
Create a MessageInput component:
Props:
- onSend(text: string)
- onTyping(typing: boolean)
Behavior:
- Text input with 1-500 char limit
- On keydown, sendTyping(true); on idle (e.g., 1s no typing), sendTyping(false)
- Enter to send (without shift), clears field
Export default.
*/
import React, { useState, useRef } from 'react'

export default function MessageInput({ onSend, onTyping }) {
	const [text, setText] = useState('')
	const timer = useRef(null)

	function handleChange(e) {
		setText(e.target.value)
		onTyping && onTyping(true)
		if (timer.current) clearTimeout(timer.current)
		timer.current = setTimeout(() => onTyping && onTyping(false), 1000)
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			submit()
		}
	}

	function submit() {
		const t = text.trim()
		if (!t) return
		onSend && onSend(t)
		setText('')
		onTyping && onTyping(false)
	}

	return (
		<div>
			<textarea value={text} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Type a message" rows={3} style={{ width: '100%' }} />
			<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
				<button onClick={submit} disabled={!text.trim()}>Send</button>
			</div>
		</div>
	)
}
