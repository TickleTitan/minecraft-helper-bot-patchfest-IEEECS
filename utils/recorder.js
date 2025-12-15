// utils/recorder.js
class Recorder {
  constructor(log) {
    this.log = log;
    this.events = [];
    this.recording = false;
    this.startTime = 0;
  }

  start() {
    this.events = [];
    this.recording = true;
    this.startTime = Date.now();
    this.log("Recorder started");
  }

  stop() {
    this.recording = false;
    this.log(`Recorder stopped; ${this.events.length} events`);
  }

  record(type, data) {
    if (!this.recording) return;
    this.events.push({
      t: Date.now() - this.startTime,
      type,
      data
    });
  }

  async replay(bot) {
    this.log(`Replaying ${this.events.length} events`);
    const start = Date.now();
    for (const e of this.events) {
      const wait = e.t - (Date.now() - start);
      if (wait > 0) await new Promise(r => setTimeout(r, wait));

      if (e.type === "chat") {
        bot.chat(e.data.message);
      }
      // extend with movement / dig, etc.
    }
  }
}

module.exports = { Recorder };
