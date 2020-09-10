const commando = require("discord.js-commando");
const queue = require("../../index");
const { MessageEmbed } = require("discord.js");

class Queue extends commando.Command {
  constructor(client) {
    super(client, {
      name: "queue",
      group: "music",
      memberName: "queue",
      description: "shows the queue of songs",
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  //TODO
  async run(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue.songs.length)
      return message.channel.send("No songs in the queue");
    /*
    for (var i = 0; i < serverQueue.songs.length; i++) {
      message.channel.send(i + 1 + ". " + serverQueue.songs[i].title);
    }
    */
    const titleArray = [];
    serverQueue.songs.slice(0, serverQueue.songs.length).forEach((track) => {
      titleArray.push(track.title);
    });
    let queueEmbed = new MessageEmbed()
      .setColor("#ff7373")
      .setTitle(`Music Queue - ${titleArray.length} items`);
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
    }
    return message.say(queueEmbed);
  }
}

module.exports = Queue;
