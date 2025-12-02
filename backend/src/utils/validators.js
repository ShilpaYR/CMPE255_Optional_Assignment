/**
GitHub Copilot Prompt:
Provide small validation helpers:
- sanitizeRoomName(name): trims, enforces 1-40 chars, alphanumeric plus spaces/dashes; returns null if invalid
- sanitizeNickname(nick): trims, 1-24 chars, printable; returns null if invalid
- sanitizeMessage(text): trims, 1-500 chars; returns null if invalid
Export the functions.
Include JSDoc and simple regex checks.
*/
/**
 * Trim and validate a room name.
 * @param {string} name
 * @returns {string|null}
 */
function sanitizeRoomName(name) {
	if (!name && name !== '') return null
	const s = String(name).trim()
	if (s.length < 1 || s.length > 40) return null
	// allow letters, numbers, spaces, dashes and underscores
	if (!/^[\w\- ]+$/.test(s)) return null
	return s
}

/**
 * Trim and validate a nickname.
 * @param {string} nick
 * @returns {string|null}
 */
function sanitizeNickname(nick) {
	if (!nick && nick !== '') return null
	const s = String(nick).trim()
	if (s.length < 1 || s.length > 24) return null
	// disallow control characters
	if (/\p{C}/u.test(s)) return null
	return s
}

/**
 * Trim and validate a message text.
 * @param {string} text
 * @returns {string|null}
 */
function sanitizeMessage(text) {
	if (!text && text !== '') return null
	const s = String(text).trim()
	if (s.length < 1 || s.length > 500) return null
	return s
}

module.exports = {
	sanitizeRoomName,
	sanitizeNickname,
	sanitizeMessage,
}
