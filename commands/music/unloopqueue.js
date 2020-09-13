const commando = require("discord.js-commando");
const queue = require("../../index");

class UnloopQueue extends commando.Command {
  constructor(client) {
    super(client, {
      name: "unloopqueue",
      group: "music",
      memberName: "unloopqueue",
      description: "cancels the order to loop the current queue.",
    });
  }

  async run(message) {
    if (!message.member.voice.channel)
      return message.channel.send("You must be in a voice channel to loop");
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("nothing to loop!");
    if (!queue.continue) return message.channel.send("Already the plan!");
    queue.continue = false;
    return message.channel.send("Won't repeat the queue!");
  }
}

module.exports = UnloopQueue;
