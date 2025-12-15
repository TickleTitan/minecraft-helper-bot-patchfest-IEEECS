// movement/come.js
const { goals } = require('mineflayer-pathfinder');

module.exports = {
  name: "come",
  aliases: [],
  execute(bot, username, args, { log }) {
    if (args.length !== 3) {
      bot.chat(`@${username} Usage: .come <x> <y> <z>`);
      return;
    }
    const [xStr, yStr, zStr] = args;
    const x = Number(xStr), y = Number(yStr), z = Number(zStr);
    if ([x, y, z].some(Number.isNaN)) {
      bot.chat(`@${username} Coordinates must be numbers.`);
      return;
    }
    const goal = new goals.GoalBlock(x, y, z);
    bot.chat(`@${username} On my way to ${x} ${y} ${z}...`);
    bot.pathfinder.setGoal(goal);
  }
};
