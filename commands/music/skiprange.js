const commando = require("discord.js-commando");
const queue = require("../../index");

class SkipRange extends commando.Command {
  constructor(client) {
    super(client, {
      name: "skiprange",
      group: "music",
      memberName: "skiprange",
      description:
        "removes a range of songe in the queue. Ex: !?skiprange 5 25",
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    const args = message.content.split(/ +/);
    const patterns = new RegExp("^[0-9]*$");
    if (!serverQueue) return message.channel.send("There is nothing to skip");
    if (!message.member.voice.channel)
      return message.channel.send(
        "You must be in a voice channel to skip songs"
      );
    if (args.length > 3 || args.length == 1)
      return message.channel.send(
        "Make sure you provide the correct amount of values"
      );
    if (!patterns.test(args[1]) && !patterns.test(args[2]))
      return message.channel.send("Make sure you enter real numbers");
    if (
      parseInt(args[1]) > serverQueue.songs.length ||
      parseInt(args[2]) > serverQueue.songs.length
    )
      return message.channel.send("The range exceeds the queue size");
    else
      serverQueue.songs.splice(
        parseInt(args[1] - 1),
        parseInt(args[2]) - parseInt(args[1])
      );
    return message.channel.send(
      "Songs removed! Check the queue to see for yourself"
    );
  }
}

module.exports = SkipRange;
