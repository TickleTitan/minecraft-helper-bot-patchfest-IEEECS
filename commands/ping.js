// commands/ping.js
module.exports = {
  name: "ping",
  aliases: ["pong"],
  execute(bot, username, args) {
    bot.chat(`@${username} Pong!`);
  }
};