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

    const homebrew = interaction.options.getBoolean('homebrew');
    const gming = interaction.options.getBoolean('gming');
    const style = interaction.options.getString('style');
    const preference = interaction.options.getString('preference');
    const system = interaction.options.getString('system');
    const description = interaction.options.getString('description');
    const expectations = interaction.options.getString('expectations');
    const obj = {
      campaignPreference: preference,
      campaignStyle: style,
      homebrewAllowed: homebrew,
      availableToDm: gming
    };

    if (property == 'player') {
      if (description) {
        profile.playerDescription = description;
      }
      if (expectations) {
        profile.playerExpectations = expectations;  
      }
    } else {
      if (description) {
        profile.gmDescription = description;
      }
      if (expectations) {
        profile.gmExpectations = expectations;  
      }
    }
    if (system) {
      const exists = profile.preferredSystem.find(x => x == system);
      if (exists) {
        profile.preferredSystem.pull(system);
      } else {
        profile.preferredSystem.push(system);
      }
    }
    profile.set(...obj);
    await profile.save();
    await interaction.followUp({ content: 'Profile Updated!', ephemeral: true });
  }
}