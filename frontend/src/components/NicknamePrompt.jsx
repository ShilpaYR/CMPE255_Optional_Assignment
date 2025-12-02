/**
GitHub Copilot Prompt:
Create a NicknamePrompt component:
Props:
- value, onChange, onSubmit
Behavior:
- Input for nickname (1-24 chars), Save button disabled if invalid
- On Enter, submit
- Show a tiny helper text about visibility to others
Export default.
*/
import React, { useState, useEffect } from 'react'

export default function NicknamePrompt({ value, onChange, onSubmit }) {
	const [local, setLocal] = useState(value || '')

	useEffect(() => setLocal(value || ''), [value])

	const valid = local.trim().length > 0 && local.trim().length <= 24

	function submit(e) {
		e && e.preventDefault()
		if (!valid) return
		onChange(local.trim())
		onSubmit && onSubmit(local.trim())
	}

	return (
		<form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
			<input
				value={local}
				onChange={(e) => setLocal(e.target.value)}
				placeholder="Your nickname"
				aria-label="nickname"
			/>
			<button type="submit" disabled={!valid}>
				Save
			</button>
			<div style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>Nickname is visible to others</div>
		</form>
	)
}
