// minecraft-helper-bot / index.js
// PatchFest bot – modular version (with .mine area support)

require('dotenv').config();
const mineflayer = require('mineflayer');
const path = require('path');
const fs = require('fs');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder'); // movement 

const { log } = require('./utils/logger');          // utils/logger.js
const { parseCommand } = require('./utils/parser'); // utils/parser.js

const commands = {};

function loadCommandsFrom(dir) {
  const full = path.join(__dirname, dir);
  if (!fs.existsSync(full)) return;

  const files = fs.readdirSync(full).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const cmd = require(path.join(full, file));
    if (!cmd || !cmd.name || typeof cmd.execute !== 'function') continue;

    commands[cmd.name] = cmd;
    if (Array.isArray(cmd.aliases)) {
      for (const alias of cmd.aliases) {
        commands[alias] = cmd;
      }
    }
  }
}

// load all command modules
loadCommandsFrom('commands');   // hello, help, say, coords, ai, record, etc.
loadCommandsFrom('movement');   // come, follow, stop, mineArea
loadCommandsFrom('inventory');  // listitems, throwall, equip


const bot = mineflayer.createBot({
  host: process.env.MC_HOST || 'localhost',
  port: process.env.MC_PORT ? parseInt(process.env.MC_PORT, 10) : 25565,
  username: process.env.MC_USERNAME || 'PatchFestBot'
});

bot.loadPlugin(pathfinder); 


bot.once('spawn', () => {
  log(`Bot spawned as "${bot.username}"`);
  bot.chat('Hello everyone! The helper bot has joined the server 🎉');

  // Default movement settings for pathfinder
  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);
  bot.pathfinder.setMovements(defaultMove);
});



bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  const parsed = parseCommand(message);
  if (!parsed) return; // not a command

  const { name: commandName, args } = parsed;
  const cmd = commands[commandName];
  if (!cmd) return; // unknown command

  try {
    // goals is passed so movement commands (come, follow, mine area) can use GoalBlock/GoalFollow
    cmd.execute(bot, username, args, { log, goals });
  } catch (err) {
    log(`Error in command .${commandName}: ${err.stack}`);
    bot.chat(`@${username} Unexpected error running .${commandName}`);
  }
});


bot.on('error', (err) => {
  log(`Bot error: ${err.message}`);
});

bot.on('end', () => {
  log('Bot disconnected from server');
});
