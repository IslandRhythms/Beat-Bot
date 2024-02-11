const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatecharacterstatus').setDescription('change the status of one of your characters.')
  .addStringOption(option => option.setName('characterid').setDescription('the id of the character'))
  .addStringOption(option => option.setName('name').setDescription('the name of the character'))
  .addBooleanOption(option => option.setName('vitals').setDescription('is the character alive (true) or dead (false)?'))
  .addBooleanOption(option => option.setName('retired').setDescription('is the character retired (true) or not retired (false)?'))
  .addBooleanOption(option => option.setName('favorite').setDescription('is this your favorite character?'))
  .addBooleanOption(option => option.setName('hero').setDescription('Did you complete your campaign with this character?')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { User, Character } = conn.models;
    const id = interaction.options.getString('characterid');
    const name = interaction.options.getString('name');
    if (!name && !id) {
      return interaction.followUp('You must provide either the character id or the character name to make updates.');
    }
    // should have the corresponding text input for each option perhaps? Might need to use the modal component maybe?
    // This should also handle stats?
    const vitals = interaction.options.getBoolean('vitals');
    const retired = interaction.options.getBoolean('retired');
    const favorite = interaction.options.getBoolean('favorite');
    const hero = interaction.options.getBoolean('hero');
    if (!vitals && !retired && !favorite && !hero) {
      return interaction.followUp('You must be updating something to use this command.');
    }
    const user = await User.findOne({ discordId: interaction.user.id });
    const obj = { player: user._id };
    if (name) {
      obj.name = name;
    }
    if (id) {
      obj.characterId = id;
    }
    const character = await Character.findOne(obj);
    if (favorite) {
      const previousFavorite = await Character.findOne({ player: user._id, isFavorite: true });
      if (previousFavorite) {
        previousFavorite.isFavorite = false;
        await previousFavorite.save();
      }
      character.isFavorite = favorite;
    }
    if (vitals) {
      character.isAlive = vitals;
    }
    if (retired) {
      character.isRetired = retired;
    }
    if (hero) {
      character.isHero = hero;
    }
    await character.save();
    await interaction.followUp({ content: 'Character Updated!', ephemeral: true });
  }
}