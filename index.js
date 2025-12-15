// minecraft-helper-bot / index.js
// Minimal PatchFest Starter Bot
const path = require("path");
const fs = require("fs");

const commands = {};

// Load commands dynamically if folder exists
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
  for (const file of files) {
    const cmd = require(path.join(commandsPath, file));
    if (!cmd || !cmd.name || typeof cmd.execute !== "function") continue;

    commands[cmd.name] = cmd;
    if (Array.isArray(cmd.aliases)) {
      for (const alias of cmd.aliases) {
        commands[alias] = cmd;
      }
    }
  }
}

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
  if (username === bot.username) return;
  if (!message.startsWith(".")) return;

  const parts = message.trim().split(/\s+/);
  const commandName = parts[0].slice(1).toLowerCase(); // remove leading '.'
  const args = parts.slice(1);

  // 1) dynamic commands from /commands
  if (commands[commandName]) {
    try {
      commands[commandName].execute(bot, username, args);
    } catch (err) {
      console.error(err);
      bot.chat(`@${username} Something went wrong running that command.`);
    }
    return;
  }

  // 2) built‑in commands in this file
  if (commandName === "hello") {
    bot.chat(`Hello ${username}! I am your helper bot 🤝`);
    return;
  }

  if (commandName === "help") {
    bot.chat("Commands: .hello, .help, .coords / .whereami, .say <message>, .ping");
    return;
  }

  if (commandName === "coords" || commandName === "whereami") {
    const pos = bot.entity.position;              // current bot position [web:100]
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);
    const z = Math.round(pos.z);
    bot.chat(`@${username} I am currently at X:${x} Y:${y} Z:${z}`);
    return;
  }

  if (commandName === "say") {
    if (args.length === 0) {
      bot.chat(`@${username} Usage: .say <message>`);
      return;
    }
    bot.chat(args.join(" "));
    return;
  }
});