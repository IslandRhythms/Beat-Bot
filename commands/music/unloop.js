const commando = require("discord.js-commando");
const queue = require("../../index");

class Unloop extends commando.Command {
  constructor(client) {
    super(client, {
      name: "unloop",
      group: "music",
      memberName: "unloop",
      description: "ends the loop of the song currently playing",
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You must be in a voice channel to unloop songs"
      );
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("nothing to unloop!");
    if (!queue.repeat) return message.channel.send("Already unlooped!");
    queue.repeat = false;
    return message.channel.send("Will unloop boss!");
  }
}

module.exports = Unloop;
