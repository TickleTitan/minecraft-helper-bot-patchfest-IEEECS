// minecraft-helper-bot / index.js
// Minimal PatchFest Starter Bot
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
bot.loadPlugin(pathfinder);

const path = require("path");
const fs = require("fs");

const commands = {};

const { log } = require('./lib/logger');
const { parseCommand } = require('./lib/parser');

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
  log(`🤖 Bot successfully spawned into the world as "${bot.username}"!`);
  // join message to users
  bot.chat('Hello everyone! The helper bot has joined the server 🎉');

  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);
  bot.pathfinder.setMovements(defaultMove);
});

// Basic chat command listener
bot.on("chat", (username, message) => {
  if (username === bot.username) return;
  
  const parsed = parseCommand(message);
  if (!parsed) return;

  const { name: commandName, args } = parsed;

  // 1) dynamic commands from /commands
  if (commands[commandName]) {
    try {
      commands[commandName].execute(bot, username, args);
    } catch (err) {
      log(`Error executing command ${commandName}: ${err.message}`);
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
    bot.chat("Commands: .hello, .help, .coords / .whereami, .say <message>, .ping, .stop");
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

    if (commandName === "stop") {
    if (bot.clearControlStates) bot.clearControlStates();
    if (bot.pathfinder) bot.pathfinder.setGoal(null);
    bot.chat(`@${username} Stopped current actions.`);
    return;
  }


    if (commandName === "listitems" || commandName === "items") {
    const items = bot.inventory.items();
    if (!items.length) {
      bot.chat(`@${username} My inventory is empty.`);
      return;
    }
    const summary = items
      .map(i => `${i.count}x ${i.displayName}`)
      .join(", ");
    bot.chat(`@${username} I currently have: ${summary}`);
    return;
  }

    if (commandName === "throwall") {
    if (args[0] !== "confirm") {
      bot.chat(`@${username} This will drop ALL items. Use ".throwall confirm" to proceed.`);
      return;
    }
    const items = bot.inventory.items();
    if (!items.length) {
      bot.chat(`@${username} Nothing to drop.`);
      return;
    }

    // Drop sequentially
    (async () => {
      for (const item of items) {
        try {
          await bot.tossStack(item);
        } catch (err) {
          log(`Error dropping ${item.displayName}: ${err.message}`);
        }
      }
      bot.chat(`@${username} Dropped all items.`);
    })();

    return;
  }

    if (commandName === "equip") {
    if (args.length === 0) {
      bot.chat(`@${username} Usage: .equip <item-name>`);
      return;
    }
    const query = args.join(" ").toLowerCase();
    const item = bot.inventory.items().find(
      i => i.displayName.toLowerCase().includes(query)
    );
    if (!item) {
      bot.chat(`@${username} I don't have any item matching "${query}".`);
      return;
    }

    bot.equip(item, "hand", err => {
      if (err) {
        log(`Equip error: ${err.message}`);
        bot.chat(`@${username} Failed to equip ${item.displayName}.`);
        return;
      }
      bot.chat(`@${username} Equipped ${item.displayName} in hand.`);
    });
    return;
  }
  
    if (commandName === "come") {
    if (args.length !== 3) {
      bot.chat(`@${username} Usage: .come <x> <y> <z>`);
      return;
    }

    const [xStr, yStr, zStr] = args;
    const x = Number(xStr);
    const y = Number(yStr);
    const z = Number(zStr);

    if ([x, y, z].some(n => Number.isNaN(n))) {
      bot.chat(`@${username} Coordinates must be numbers.`);
      return;
    }

    const goal = new goals.GoalBlock(x, y, z);
    bot.chat(`@${username} On my way to ${x} ${y} ${z}...`);
    bot.pathfinder.setGoal(goal);
    return;
  }

    if (commandName === "follow") {
    if (args.length !== 1) {
      bot.chat(`@${username} Usage: .follow <playerName>`);
      return;
    }
    const targetName = args[0];
    const target = bot.players[targetName]?.entity;
    if (!target) {
      bot.chat(`@${username} I can't see player "${targetName}" right now.`);
      return;
    }

    const goal = new goals.GoalFollow(target, 2); // stay within 2 blocks
    bot.chat(`@${username} Following ${targetName}. Use .stop to cancel.`);
    bot.pathfinder.setGoal(goal, true); // dynamic
    return;
  }


});