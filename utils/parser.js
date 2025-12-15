// lib/parser.js
function parseCommand(message) {
  if (!message.startsWith(".")) return null;
  const parts = message.trim().split(/\s+/);
  if (!parts.length) return null;
  return {
    name: parts[0].slice(1).toLowerCase(),
    args: parts.slice(1)
  };
}
module.exports = { parseCommand };