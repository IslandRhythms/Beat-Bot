require('./config');

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const path = require("path");
const fs = require('fs');
const db = require('./db');
const tasks = require('./automations');


(async () => {

  const bot = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessagePolls
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


  bot.on("ready", async () => {
    bot.user.setActivity("type /help to see what I can do");
    // console.log(bot.application.owner)
    await bot.application.fetch();
    try {
      if (process.env.NODE_ENV !== 'production') {
        await tasks(bot);
        console.log('Automations initiated');
      }
    } catch (e) {
      console.log('Something went wrong with the automations', e);
    }
    console.log('bot ready');
  });

  bot.on('reconnecting', () => {
    bot.user.setActivity("type /help to see what I can do");
    console.log('reconnected');
  });

  bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch(); // Fetch the message if it's partial
    if (user.bot) return; // Ignore reactions from bots
  
    const { message, emoji } = reaction;
    // I think this makes it so that if I edit this file while in prod, the updates propogate through and don't require a restart.
    const roles = require('./resources/roles.json');
    if (message.channel.id === channelId && message.author.id === bot.user.id) { // Check if the reaction is on the roles message sent by the bot
      // if (roleMap[emoji.name]) {
      //   const role = message.guild.roles.cache.get(roleMap[emoji.name]);
      //   if (role) {
      //     const member = message.guild.members.cache.get(user.id);
      //     if (member) {
      //       await member.roles.add(role);
      //       console.log(`Added role ${role.name} to ${user.tag}`);
      //     }
      //   }
      // }
    }
  });

  bot.on('messageReactionRemove', (reaction, user) => {

  });


  bot.on("messageCreate", (message) => {
    if (message.author.bot) return; // prevent bot from replying to itself.
    if(message.content.includes('<@596812405733064734>')) {
      const res = Math.floor(Math.random()*(responses.length - 1)) + 1;
      return message.channel.send(`<@${message.author.id}> ${responses[res]}`)
    }
    // only works if I send it
    if (message.content == '!addRoles' && message.author.id == bot.application.owner.id) {
      // do stuff
    }
    
  });



  const conn = await db().asPromise();

  // bot.on(Events.MessagePollVoteAdd, (answer, userId) => {
  //   console.log(`User ${userId} voted for answer ${answer.id}`);
  // });
  
  // bot.on(Events.MessagePollVoteRemove, (answer, userId) => {
  //   console.log(`User ${userId} removed their vote for answer ${answer.id}`);
  // });
  
  bot.on(Events.MessageUpdate, async (_oldMessage, newMessage) => {
    if (!newMessage.poll || ( newMessage.poll && !newMessage.poll.resultsFinalized)) return;
    const { Poll } = conn.models;
    const doc = await Poll.findOne({ messageId: newMessage.id, guildId: newMessage.guildId });
    const pollId = await Poll.countDocuments();
    const guild = bot.guilds.cache.get(newMessage.guildId);
    const role = guild.roles.cache.find(role => role.id == doc.target);
    newMessage.poll.answers.forEach(async (option) => {
      const voters = await option.fetchVoters();
      doc.choices.push({ id: option.id, text: option.text, voteCount: option.voteCount });
      voters.forEach((voter) => {
        if(role && !!role.members.find(x => x.id == voter.id)) {  // if there is a target audience, need to filter out people not authorized to vote
          doc.eligibleVoters.push(voter.id);
        }
        doc.voters.push({ voter: { discordId: voter.id, discordName: voter.username }, choice: { id: option.id, text: option.text }})
      });
    });

    // tally the results
    let highestVoteCount = 0;
    const result = [];
    function tallyVote(vote) {
      if (highestVoteCount < vote.voteCount) {
        highestVoteCount = vote.voteCount;
        result.length = 0;
        result.push(vote.text);
      } else if (highestVoteCount == vote.voteCount) { // handle ties
        result.push(vote.text);
      }
    };
    newMessage.poll.answers.forEach(async (option) => {
      if (role) {
        const voters = await option.fetchVoters();
        voters.forEach((voter) => {
          if (!!role.members.find(x => x.id == voter.id)) {
            tallyVote(option);
          }
        })
      } else {
        tallyVote(option);
      }
    })

    doc.results.count = highestVoteCount;
    doc.results.selectedAnswer = result;
    doc.isRecorded = true;
    doc.pollId = `${pollId + 1}`
    await doc.save();
    const channel = bot.channels.cache.get(newMessage.channelId);
    if (highestVoteCount == 0) {
      channel.send(`The results of the Poll are in and it would appear that no one voted.`)
    } else {
      channel.send(`The results of the Poll are in! ${doc.results.selectedAnswer.join(',')} won with ${doc.results.count} votes!`)
    }
    
  });

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
      const doc = await Daily.findOne({}).sort({ createdAt: 1 });
      const pingedCommand = doc.pings.findIndex(x => x.name == interaction.commandName );
      if (pingedCommand > -1) {
        doc.pings[pingedCommand].called = doc.pings[pingedCommand].called + 1;
      } else {
        doc.pings.push({ name: interaction.commandName, called: 1 });
      }
      await doc.save();
      // need to update discord pics in the db so check when the user runs a command if their profile pic has changed.
      const user = await User.findOneAndUpdate({ discordName: interaction.user.username, discordId: interaction.user.id }, { discordName: interaction.user.username, discordId: interaction.user.id, discordPic: interaction.user.avatar }, { upsert: true });
      await GameProfile.findOneAndUpdate({ player: user._id }, { player: user._id }, { upsert: true });
      if (interaction.isAutocomplete()) {
        await command.autocomplete(interaction);
      } else {
        await command.execute(interaction, conn);
      }
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
      if (process.env.NODE_ENV === 'production') {
        const { Log } = conn.models;
        await Log.create({ commandname: interaction.commandName, message: error.message, data: error, commandOptions: interaction.options });
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

 
  bot.login(process.env.TOKEN);
})();
