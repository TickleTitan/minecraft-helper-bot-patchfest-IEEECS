// commands/say.js
module.exports = {
  name: "say",
  aliases: [],
  execute(bot, username, args, ctx) {
    if (!args.length) {
      bot.chat(`@${username} Usage: .say <message>`);
      return;
    }
    const msg = args.join(" ");
    bot.chat(msg);
  }
};
