const commando = require("discord.js-commando");
const config = require("./config.json");
const path = require("path");
const Events = require("./Events.json");
const date = require("dateformat");
const bot = new commando.Client({
  unknownCommandResponse: false,
  commandPrefix: config.prefix,
});
//need to put capital words in too as well as all caps
const language = [];
module.exports = new Map();
module.exports.repeat = false;
module.exports.continue = false;

const responses = [
  "You rang?",
  "I'm busy!",
  "What do you want?",
  "Leave me alone",
  "I have more important things to do than deal with you",
  "You can get yourself out of this situation",
  "I'm here to help friends!",
  "Don't like my sarcasm, well I don't like your stupid.",
];
bot.registry.registerGroup("random", "Random");
bot.registry.registerGroup("recommendations", "Recommendations");
bot.registry.registerGroup("fun", "Fun");
bot.registry.registerGroup("music", "Music");
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(path.join(__dirname + "/commands"));

/*
bot.setInterval(() => {
  let today = new Date();
  let format = date(today, "m/d");
  let greeting = "";
  for (let i = 0; i < Events.length; i++) {
    if (format == Object.keys(Events[i]) && format != "12/25") {
      greeting = "Happy " + Object.values(Events[i]);
    }
    if (format == "12/25") {
      greeting = "Merry Christmas";
    }
  }

  if (greeting != "") message.channel.send(greeting);
}, 86400000);

*/

bot.on("ready", () => {
  bot.user.setActivity("!?help for how I can help!");
});
bot.on("reconnecting", () => {
  bot.user.setActivity("!?help for how I can help!");
});
bot.on("message", (message) => {
  if (message.author.bot) return;

  /*
    if (message.content.includes("god") || message.content.includes("God")) {
      return message.channel.sendMessage("Tell me though, Can it bleed?");
    }

    //random responses from bot
    if (
      message.content.includes("beat bot") ||
      message.content.includes("Beat Bot")
    ) {
      return message.channel.sendMessage(
        responses[Math.floor(Math.random() * 8)]
      );
    }

    //Captain America Event
    if (language.some((word) => message.content.includes(word))) {
      return message.channel.sendMessage("Hey, language");
    }
    */
  //will take message, split it up and then put parts into array
  const args = message.content.split(/ +/);
  //Part of the presence command
  if (
    message.author.id == "314610062352187397" &&
    message.content == "activity"
  ) {
    var activity = [
      "Ready to play",
      "Chilling",
      "Doing work",
      "afk",
      "can talk",
    ];
    message.reply(activity);
  }
  if (message.author.id == "314610062352187397" && message.content == "? 0") {
    module.exports.info = args[1];
    message.reply("k");
  }
  if (message.author.id == "314610062352187397" && message.content == "? 1") {
    module.exports.info = args[1];
    message.reply("k");
  }
  if (message.author.id == "314610062352187397" && message.content == "? 2") {
    module.exports.info = args[1];
    message.reply("k");
  }
  if (message.author.id == "314610062352187397" && message.content == "? 3") {
    module.exports.info = args[1];
    message.reply("k");
  }
  if (message.author.id == "314610062352187397" && message.content == "? 4") {
    module.exports.info = args[1];
    message.reply("k");
  }
});

bot.login(config.token);
