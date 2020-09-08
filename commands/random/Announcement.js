const commando = require("discord.js-commando");
//const Events = require('../../Events.json');
class Announcement extends commando.Command {
  constructor(client) {
    super(client, {
      name: "today",
      group: "random",
      memberName: "today",
      description: "sends a message to everyone",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    var Holiday = new Date();
    var month = Holiday.getMonth() + 1;
    var day = Holiday.getDate();
    var check = month + "/" + day;
    var greeting = "";
    for (var i = 0; i < Events.length; i++) {
      if (check == Object.keys(Events[i]) && check != "12/25") {
        greeting = "Happy " + Object.values(Events[i]);
      }
      if (check == "12/25") {
        greeting = "Merry Christmas";
      }
    }

    if (greeting != "") {
      message.channel.sendMessage(greeting);
    } else {
      message.channel.sendMessage("Nothing Special Today");
    }
  }
}

//module.exports = Announcement;
