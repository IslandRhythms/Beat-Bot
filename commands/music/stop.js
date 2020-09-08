const commando = require("discord.js-commando");
const queue = require("../../index");

class Stop extends commando.Command {
  constructor(client) {
    super(client, {
      name: "stop",
      group: "music",
      memberName: "stop",
      description: "stops the music, feelsbadman don't be a party pooper",
    });
  }

  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
}

module.exports = Stop;
