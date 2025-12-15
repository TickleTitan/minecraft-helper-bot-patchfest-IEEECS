// commands/record.js
module.exports = {
  name: "record",
  aliases: [],
  execute(bot, username, args, { recorder }) {
    if (args[0] === "start") {
      recorder.start();
      bot.chat(`@${username} Recording started.`);
    } else if (args[0] === "stop") {
      recorder.stop();
      bot.chat(`@${username} Recording stopped.`);
    } else if (args[0] === "replay") {
      recorder.replay(bot);
      bot.chat(`@${username} Replaying recorded actions.`);
    } else {
      bot.chat(`@${username} Usage: .record start|stop|replay`);
    }
  }
};
