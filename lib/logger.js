// lib/logger.js
function log(message) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${message}`);
}
module.exports = { log };
