// movement/follow.js
const { goals } = require('mineflayer-pathfinder');

module.exports = {
  name: "follow",
  aliases: [],
  execute(bot, username, args, { log }) {
    if (args.length !== 1) {
      bot.chat(`@${username} Usage: .follow <playerName>`);
      return;
    }
    const targetName = args[0];
    const target = bot.players[targetName]?.entity;
    if (!target) {
      bot.chat(`@${username} I can't see "${targetName}" right now.`);
      return;
    }
    const goal = new goals.GoalFollow(target, 2);
    bot.chat(`@${username} Following ${targetName}. Use .stop to cancel.`);
    bot.pathfinder.setGoal(goal, true);
  }
};
