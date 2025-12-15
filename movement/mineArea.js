// movement/mineArea.js
// .mine area <radius> – area mining with basic tool requirements

const { ensureToolEquipped } = require('../inventory/toolLogic');

module.exports = {
  name: "mine",
  aliases: [],
  async execute(bot, username, args, { log }) {
    // Expect: .mine area <radius>
    if (args.length !== 2 || args[0] !== "area") {
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

    // Very simple cube scan – can be optimized later
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dz = -radius; dz <= radius; dz++) {
          const pos = center.offset(dx, dy, dz);
          const block = bot.blockAt(pos);
          if (!block) continue;
          if (!block.diggable) continue;

          // Safety: skip dangerous or useless blocks
          if (["bedrock", "air", "lava", "water"].includes(block.name)) continue;

          // Tool requirement logic (Issue 23)
          const ok = await ensureToolEquipped(bot, block, log);
          if (!ok) continue;

          try {
            await bot.dig(block);
          } catch (err) {
            log(`Error digging ${block.name} at ${pos}: ${err.message}`);
          }
        }
      }
    }

    bot.chat(`@${username} Finished area mining.`);
  }
};
