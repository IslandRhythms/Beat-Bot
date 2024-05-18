const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
require('../config');
const db = require('../db');
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

// When the bot is ready
client.once('ready', async () => {
  console.log('Bot is ready.');

  try {
    const conn = await db().asPromise();
    const { User } = conn.models;
    // Fetch all users from the server
    const guilds = client.guilds.cache.values();
    for (const guild of guilds) {
      const members = await guild.members.fetch();

      // Iterate over each member and create a user document in MongoDB
      for (const member of members.values()) {
        const user = await User.findOne({ discordId: member.user.id });
        if (user) {
          console.log(`${member.user.id} already has a document in the db, adding server to list of servers`)
          user.discordServers.push(guild.id);
          await user.save()
        } else {
          const newUser = new User({
            discordName: member.user.username,
            discordId: member.user.id,
            discordPic: member.user.avatarURL() ?? `No discord pic`,
            discordServers: [guild.id]
          });
          await newUser.save();
          console.log(`User ${member.user.tag} added to MongoDB.`);
        }
      }
    }

    // Disconnect from MongoDB
    await db().close();
    console.log('Disconnected from MongoDB.');

    // Logout and destroy the bot client
    await client.destroy();
    process.exit(0)
  } catch (error) {
    console.error('Error:', error);
    process.exit(-1)
  }
});

// Log in to Discord with the bot token
client.login(token);
})();
