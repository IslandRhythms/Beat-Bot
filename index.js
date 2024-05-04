require('./config');

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const path = require("path");
const fs = require('fs');
const db = require('./db');
const tasks = require('./automations');
const Occasions = require("./Events.json");
const date = require("dateformat");

(async () => {

  const bot = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates
    ] 
  });
  bot.commands = new Collection();
  bot.cooldowns = new Collection();
  const player = new Player(bot);
  await player.extractors.loadDefault();
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  module.exports.player = player; // not sure if this is needed anymore

  const responses = [
    "I'm busy!",
    "Leave me alone",
    "You can get yourself out of this situation",
    "Don't you ever message me again, you stupid fuck.",
    "Is your need for attention so great that you have to ping me?",
    "If everyone is ignoring you to the point where you have to ping me, you should reflect on your life choices up until this moment.",

  ];
  const channelids = ["784509591006347325"];//,"488053636060938242"]; //bot-testing and the-hut

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        bot.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }

  /*
  bot.setInterval(() => {
    let today = new Date();
    let format = date(today, "m/d");
    let greeting = "";
    for (let i = 0; i < Occasions.length; i++) {
      if (format == Object.keys(Occasions[i]) && format != "12/25") {
        greeting = "Happy " + Object.values(Occasions[i]);
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
  // put tasks call here so we can pass client
  bot.on("ready", () => {
    bot.user.setActivity("type /help to see what I can do");
  });

  bot.on('reconnecting', () => {
    bot.user.setActivity(" type /help to see what I can do");
  })

  const conn = await db().asPromise();

  bot.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return; // bot ignores if not command or autocomplete setup
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
      }
    }

    try {
      const { User, Daily, GameProfile } = conn.models;
      // const doc = await Daily.findOne({}).sort({ createdAt: 1 });
      // doc.pings += 1;
      // await doc.save();
      // need to update discord pics in the db so check when the user runs a command if their profile pic has changed.
      const user = await User.findOneAndUpdate({ discordName: interaction.user.username, discordId: interaction.user.id }, { discordName: interaction.user.username, discordId: interaction.user.id, discordPic: interaction.user.avatar }, { upsert: true });
      // await GameProfile.findOneAndUpdate({ player: user._id }, { player: user._id }, { upsert: true });
      if (interaction.isAutocomplete()) {
        await command.autocomplete(interaction);
      } else {
        await command.execute(interaction, conn);
      }
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
      if (process.env.NODE_ENV === 'production') {
        const { Error } = conn.models;
        await Error.create({ commandname: interaction.commandName, message: error.message, data: error, commandOptions: interaction.options });
      }
      if (!interaction.replied) {
        if (interaction.deferred) {
          await interaction.followUp('something went wrong...');
        }
        else {
          await interaction.reply('something went wrong...');
        }
      }
    }
  });
  /*
  bot.on('guildMemberAdd', guildMember => {
    let title = guildMember.guild.roles.cache.find(role => role.name === 'Band Kids');
    guildMember.roles.add(title);
  });
  */

  bot.on("messageCreate", (message) => {
    if (message.author.bot) return; // prevent bot from replying to itself.
    if(message.content.includes('<@596812405733064734>')) {
      const res = Math.floor(Math.random()*(responses.length - 1)) + 1;
      return message.channel.send(`<@${message.author.id}> ${responses[res]}`)
    }
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
  bot.login(process.env.TOKEN);
  console.log('logged in');
  try {
    if (process.env.NODE_ENV === 'production') {
      await tasks(db, bot);
      console.log('Automations initiated');
    }
  } catch (e) {
    console.log('Something went wrong with the automations', e);
  }
})();
