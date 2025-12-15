// commands/help.js
module.exports = {
  name: "help",
  aliases: [],
  execute(bot, username, args, ctx) {
    bot.chat(
      "Commands: .hello, .help, .coords / .whereami, .say <msg>, .come x y z, .follow <player>, .stop, .listitems, .throwall confirm, .equip <item>"
    );
  }
};
