// movement/mineArea.js
// .mine area <radius> – area mining with tool requirements + movement

const { ensureToolEquipped } = require('../inventory/toolLogic');
const { goals } = require('mineflayer-pathfinder');

module.exports = {
  name: 'mine',
  aliases: [],
  async execute(bot, username, args, { log }) {
    // .mine area <radius>
    if (args.length !== 2 || args[0] !== 'area') {
      bot.chat(`@${username} Usage: .mine area <radius>`);
      return;
    }

    const radius = Number(args[1]);
    if (!Number.isFinite(radius) || radius <= 0 || radius > 10) {
      bot.chat(`@${username} Radius must be a number between 1 and 10.`);
      return;
    }

    const center = bot.entity.position.clone();
    bot.chat(`@${username} Mining around me with radius ${radius}...`);

    const targets = [];

    // Collect candidate blocks first
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dz = -radius; dz <= radius; dz++) {
          const pos = center.offset(dx, dy, dz);
          const block = bot.blockAt(pos);
          if (!block) continue;
          if (!block.diggable) continue;
          if (['bedrock', 'air', 'lava', 'water'].includes(block.name)) continue;
          targets.push(block);
        }
      }
    }

    // Process each target: move near, equip tool, dig
    for (const block of targets) {
      // Check again (may have been mined already)
      if (!block.diggable) continue;

      // Move near the block (1 block away)
      const goal = new goals.GoalNear(block.position.x, block.position.y, block.position.z, 1);
      try {
        await bot.pathfinder.goto(goal);
      } catch (err) {
        log(`Pathfinder could not reach block ${block.name} at ${block.position}: ${err.message}`);
        continue;
      }

      // Tool requirement logic
      const ok = await ensureToolEquipped(bot, block, log);
      if (!ok) continue;

      try {
        await bot.dig(block);
      } catch (err) {
        log(`Error digging ${block.name} at ${block.position}: ${err.message}`);
      }
    }

    bot.chat(`@${username} Finished area mining.`);
  }
};
