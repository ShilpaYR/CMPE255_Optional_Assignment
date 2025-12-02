/**
GitHub Copilot Prompt:
Create the root App component with React Router.

Routes:
- "/" -> Lobby page
- "/room/:roomId" -> ChatRoom page

Include a simple header with title "Realtime Chat" and a small nav back to "/".
*/
import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Lobby from './pages/Lobby'
import ChatRoom from './pages/ChatRoom'

export default function App() {
	return (
		<BrowserRouter>
			<div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
				<header style={{ padding: 12, borderBottom: '1px solid #eee', marginBottom: 12 }}>
					<Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
						<h1 style={{ margin: 0 }}>Realtime Chat</h1>
					</Link>
				</header>

				<main>
					<Routes>
						<Route path="/" element={<Lobby />} />
						<Route path="/room/:roomId" element={<ChatRoom />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	)
}
