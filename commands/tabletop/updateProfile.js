const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updateprofile').setDescription('update your profile.')
  .addSubcommand(subcommand => 
    subcommand.setName('player')
    .setDescription('Update your player profile.')
    .addStringOption(option => option.setName('system').setDescription('the system you prefer/no longer prefer'))
    .addStringOption(option => option.setName('description').setDescription('a quick summary of you so dms can get to know you.'))
    .addStringOption(option => option.setName('expectations').setDescription('what expectations you have for the game you would be a part of.'))
  )
  .addSubcommand(subcommand => 
    subcommand.setName('gm')
    .setDescription('Update your gm profile.')
      .addBooleanOption(option => option.setName('homebrew').setDescription('indicate if you allow homebrew'))
      .addBooleanOption(option => option.setName('gming').setDescription('indicate if you are available to gm'))
      .addStringOption(option => option.setName('style').setDescription('indicate how you run your games. Ex: Gritty, story driven, etc.'))
      .addStringOption(option => option.setName('preference').setDescription('indicate your campaign preference. Ex: In person or online.'))
      .addStringOption(option => option.setName('system').setDescription('the system you prefer/no longer prefer'))
      .addStringOption(option => option.setName('description').setDescription('a quick summary of you so players can get to know you.'))
      .addStringOption(option => option.setName('expectations').setDescription('what expectations you have for the players.'))
  ),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { GameProfile, User } = conn.models;
    const property = interaction.options._subcommand;
    const user = await User.findOne({ discordId: interaction.user.id });
    const profile = await GameProfile.findOne({ player: user._id }).populate('campaigns').populate('player').populate('playerCharacters').populate('dmCampaigns');
    await interaction.followUp({ content: 'Under Construction', ephemeral: true });
  }
}