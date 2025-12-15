// movement/mineArea.js
module.exports = {
  name: "mine",
  aliases: [],
  async execute(bot, username, args, { log, goals }) {
    if (args[0] !== "area" || args.length !== 2) {
      bot.chat(`@${username} Usage: .mine area <radius>`);
      return;
    }
    const radius = Number(args[1]);
    if (!Number.isFinite(radius) || radius <= 0 || radius > 10) {
      bot.chat(`@${username} Radius must be between 1 and 10.`);
      return;
    }

    const center = bot.entity.position.clone();
    bot.chat(`@${username} Mining area around me with radius ${radius}...`);

    // Very naive scan: iterate in a cube, you will optimize later
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        for (let z = -radius; z <= radius; z++) {
          const pos = center.offset(x, y, z);
          const block = bot.blockAt(pos);
          if (!block) continue;
          if (!block.diggable) continue;
          // basic safety: never mine bedrock/air/lava etc.
          if (["bedrock", "air", "lava", "water"].includes(block.name)) continue;

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
