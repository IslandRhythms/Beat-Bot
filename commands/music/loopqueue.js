const commando = require("discord.js-commando");
const queue = require("../../index");

class LoopQueue extends commando.Command {
  constructor(client) {
    super(client, {
      name: "loopqueue",
      group: "music",
      memberName: "loopqueue",
      description: "Loops the queue",
    });
  }

  async run(message) {
    if (!message.member.voice.channel)
      return message.channel.send("You must be in a voice channel to loop");
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("nothing to loop!");
    if (queue.continue) return message.channel.send("Already the plan!");
    queue.continue = true;
    return message.channel.send(
      "The queue will be repeated once all songs have been played!"
    );
  }
}

module.exports = LoopQueue;
