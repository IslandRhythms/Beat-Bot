const commando = require("discord.js-commando");
const queue = require("../../index");

class Skip extends commando.Command {
  constructor(client) {
    super(client, {
      name: "skip",
      group: "music",
      memberName: "skip",
      description:
        "skips the current or specified song. " +
        "Ex !?skip or !?skip 4 or !?skip 4 5 6 7 ..." +
        "Note: if the song is being looped, you must use the unloop command as skip will restart the current song",
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    const args = message.content.split(/ +/);
    const patterns = new RegExp("^[0-9]*$");
    let i = 1;
    if (!message.member.voice.channel)
      return message.channel.send(
        "You must be in a voice channel to skip songs"
      );
    if (!serverQueue) return message.channel.send("There is nothing to skip");
    if (args.length == 2) {
      if (parseInt(args[1]) > serverQueue.songs.length)
        return message.channel.send(
          "That number is bigger than the amount in the queue"
        );
      if (!patterns.test(args[1]))
        return message.channel.send("Make sure you enter real numbers!");

      return serverQueue.songs.splice(args[1] - 1, 1);
    } else if (args.length > 2) {
      args.some((element, index, args) => {
        if (parseInt(args[index]) > serverQueue.songs.length)
          return message.channel.send(
            "You entered a number bigger than the total in the queue"
          );
        if (index != 0 && !patterns.test(element))
          return message.channel.send("Make sure you enter real numbers");
      });
      for (i; i < args.length; i++) {
        serverQueue.songs.splice(args[i] - 1, 1);
      }
    } else serverQueue.connection.dispatcher.end();
  }
}

module.exports = Skip;
