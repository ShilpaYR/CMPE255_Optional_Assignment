/**
GitHub Copilot Prompt:
Create an Express router with:
- GET /api/health -> { ok: true, time: new Date().toISOString() }
Export the router.
*/
const express = require('express')

const router = express.Router()

router.get('/api/health', (req, res) => {
	res.json({ ok: true, time: new Date().toISOString() })
})

module.exports = router
