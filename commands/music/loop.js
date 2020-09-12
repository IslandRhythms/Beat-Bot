const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const queue = require("../../index");

class Loop extends commando.Command {
  constructor(client) {
    super(client, {
      name: "loop",
      group: "music",
      memberName: " loop",
      description: "loops the current song",
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("nothing to loop!");
    queue.repeat = true;
    return message.channel.send("Will loop chief!");
  }
}

module.exports = Loop;
