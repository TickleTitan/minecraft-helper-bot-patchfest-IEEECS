// movement/stop.js
module.exports = {
  name: "stop",
  aliases: [],
  execute(bot, username, args, { log }) {
    if (bot.clearControlStates) bot.clearControlStates();
    if (bot.pathfinder) bot.pathfinder.setGoal(null);
    bot.chat(`@${username} Stopped current actions.`);
  }
};
