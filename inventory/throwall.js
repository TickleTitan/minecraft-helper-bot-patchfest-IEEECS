// inventory/throwall.js
module.exports = {
  name: "throwall",
  aliases: [],
  execute(bot, username, args, { log }) {
    if (args[0] !== "confirm") {
      bot.chat(`@${username} This drops ALL items. Use ".throwall confirm" to proceed.`);
      return;
    }
    const items = bot.inventory.items();
    if (!items.length) {
      bot.chat(`@${username} Nothing to drop.`);
      return;
    }

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
  }
};
