// inventory/equip.js
module.exports = {
  name: "equip",
  aliases: [],
  execute(bot, username, args, { log }) {
    if (!args.length) {
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
      bot.chat(`@${username} Equipped ${item.displayName}.`);
    });
  }
};
