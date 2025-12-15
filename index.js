// minecraft-helper-bot / index.js
// Minimal PatchFest Starter Bot

require('dotenv').config();
const mineflayer = require('mineflayer');

// Create the bot instance
const bot = mineflayer.createBot({
  host: process.env.MC_HOST || "localhost",     // Server IP
  port: process.env.MC_PORT ? parseInt(process.env.MC_PORT) : 25565,
  username: process.env.MC_USERNAME || "PatchFestBot" // Bot username
});

// Bot events
bot.once('spawn', () => {
  console.log(`🤖 Bot successfully spawned into the world as "${bot.username}"!`);
  // join message to users
  bot.chat('Hello everyone! The helper bot has joined the server 🎉');
});

// Basic chat command listener
bot.on("chat", (username, message) => {

  if (username === bot.username) return; // ignore itself

  if (message === ".hello") {
    bot.chat(`Hello ${username}! I am your helper bot 🤝`);
  }

  //added .help command
  if (message === ".help") {
    bot.chat("Commands: .hello, .help, .coords / .whereami, .say <message>");
  }  
});
