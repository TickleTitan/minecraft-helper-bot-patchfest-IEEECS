// inventory/listitems.js
module.exports = {
  name: "listitems",
  aliases: ["items"],
  execute(bot, username) {
    const items = bot.inventory.items();
    if (!items.length) {
      bot.chat(`@${username} My inventory is empty.`);
      return;
    }
    const summary = items
      .map(i => `${i.count}x ${i.displayName}`)
      .join(", ");
    bot.chat(`@${username} I have: ${summary}`);
  }
};
