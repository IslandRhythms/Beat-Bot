const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const capitalizeFirstLetter = require('../../helpers/capitalizeFirstLetter');


module.exports = {
  data: new SlashCommandBuilder().setName('getprofile').setDescription('get a user\'s profile.')
  .addSubcommand(subcommand => 
    subcommand.setName('player')
    .setDescription('Get their player profile.')
      .addUserOption(option => option.setName('target')
      .setDescription('the user\'s profile you wish to see. Omit to get your profile.')))
  .addSubcommand(subcommand => 
    subcommand.setName('gm')
    .setDescription('Get their gm profile.')
      .addUserOption(option => option.setName('target')
      .setDescription('the user\'s profile you wish to see. Omit to get your profile.'))),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { GameProfile, User } = conn.models;
    const property = interaction.options._subcommand;
    const target = interaction.options.getUser('target') ?? interaction.user;
    const user = await User.findOne({ discordId: target.id });
    const profile = await GameProfile.findOne({ player: user._id }).populate('campaigns').populate('player').populate('playerCharacters').populate('dmCampaigns');
    const embeds = [];
    // console.log(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.png`)
    if (property == 'player') {
      const embed = new EmbedBuilder().setTitle(`${target.username}'s TableTop ${capitalizeFirstLetter(property)} Profile`);
      embed.setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.png`);
      embed.addFields({ name: 'Overall Player Level', value: profile.overallPlayerLevel, inline: true });
      embed.addFields({ name: 'Total Player Characters', value: profile.numPlayerCharacters, inline: true });
      embed.addFields({ name: 'Number of campaigns participated as player', value: profile.numCampaigns, inline: true });
      embed.addFields({ name: 'Availability', value: profile.player.availability.join(',')});
      for (let i = 0; i < profile.campaigns.length; i++) {
        embed.addFields({ name: profile.campaigns[i].title, value: profile.campaigns[i].system, inline: true });
      }
      for (let index = 0; index < profile.playerCharacters.length; index++) {
        embed.addFields({ name: profile.playerCharacters[i].name,
          value: profile.playerCharacters[i].classes.map(function (entry) { return `${entry.name} ${entry.level}` }).join(','), inline: true })
      }
      embeds.push(embed);
    } else {
      const embed = new EmbedBuilder().setTitle(`${target.username}'s TableTop ${capitalizeFirstLetter(property)} Profile`);
      embed.setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.png`);
      embed.addFields({ name: 'Availability', value: profile.player.availability.join(',')});
      embed.addFields({ name: 'Number of campaigns as DM', value: profile.numDmCampaigns, inline: true });
      embed.addFields({ name: 'Homebrew Allowed', value: profile.homebrewAllowed, inline: true });
      embed.addFields({ name: 'Available', value: profile.availableToDm, inline: true });
      embed.addFields({ name: 'Campaign Preference', value: profile.campaignPreference, inline: true });
      embed.addFields({ name: 'Campaign Style', value: profile.campaignStyle, inline: true });
      embed.addFields({ name: 'Preferred System', value: profile.preferredSystem.join(','), inline: true });
      for (let i = 0; i < profile.dmCampaigns.length; i++) {
        embed.addFields({ name: profile.dmCampaigns[i].title, value: profile.dmCampaigns[i].system, inline: true });
      }
      embeds.push(embed);
    }
    await interaction.followUp({ embeds, ephemeral: true });
  }
}