const { Client, GatewayIntentBits } = require('discord.js');
require('../config');
process.env.NODE_ENV = 'local';

(async () => {
// Create a Discord client
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.GuildMessageReactions
  ] 
});

// Define your Discord bot token
const token = process.env.TOKEN;

// guild name or id
const guildIdentifier = process.argv[2];
if (!guildIdentifier) {
  throw new Error('Must provide either a guild name or guildId')
}

// When the bot is ready
client.once('ready', async () => {
  console.log('Bot is ready.');
  const guilds = client.guilds.cache.values();
  for (const guild of guilds) {
    console.log(guild);
    if (guild.name == guildIdentifier || guild.id == guildIdentifier) {
      await guild.leave();
    }
  }
});

// Log in to Discord with the bot token
client.login(token);
})();
