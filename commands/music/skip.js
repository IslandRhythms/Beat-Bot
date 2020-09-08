const commando = require("discord.js-commando");
const queue = require("../../index");

class Skip extends commando.Command {
  constructor(client) {
    super(client, {
      name: "skip",
      group: "music",
      memberName: "skip",
      description: "skips the current song",
    });
  }

  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel.send(
        "You must be in a voice channel to skip songs"
      );
    if (!serverQueue) return message.channel.send("There is nothing to skip");
    serverQueue.connection.dispatcher.end();
  }
}

module.exports = Skip;
