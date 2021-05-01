const commando = require("discord.js-commando");
const config = require("./config.json");
const path = require("path");
const Events = require("./Events.json");
const date = require("dateformat");
const bot = new commando.CommandoClient({
  unknownCommandResponse: false,
  commandPrefix: "?",
  owner: "314610062352187397",
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
const channelids = ["784509591006347325"];//,"488053636060938242"]; //bot-testing and the-hut
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
if (greeting != ""){
    for(let j = 0; j < channelids.length; j++){
  let channel = bot.channels.cache.get(channelids[j]); 
   channel.send("@everyone "+greeting);
    }
  }
}, 86400000);

*/

bot.on("ready", () => {
  bot.user.setActivity("!?help for how I can help!");
});
bot.on("reconnecting", () => {
  bot.user.setActivity("!?help for how I can help!");
});
bot.on('guildMemberAdd', guildMember => {
  let title = guildMember.guild.roles.cache.find(role => role.name === 'Band Kids');
  guildMember.roles.add(title);
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
  //const args = message.content.split(/ +/);
  
});

bot.login(config.token);
