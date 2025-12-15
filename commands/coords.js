// commands/coords.js
module.exports = {
  name: "coords",
  aliases: ["whereami"],
  execute(bot, username, args, ctx) {
    const pos = bot.entity.position;           // bot position [web:100]
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);
    const z = Math.round(pos.z);
    bot.chat(`@${username} I am at X:${x} Y:${y} Z:${z}`);
  }
};
