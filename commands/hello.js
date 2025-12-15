// commands/hello.js
module.exports = {
  name: "hello",
  aliases: [],
  execute(bot, username, args, ctx) {
    bot.chat(`Hello ${username}! I am your helper bot 🤝`);
  }
};
