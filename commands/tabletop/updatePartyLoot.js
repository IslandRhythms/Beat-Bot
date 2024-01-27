const { SlashCommandBuilder } = require('discord.js');
const getPlayersActiveCharacter = require('../../helpers/getPlayersActiveCharacter');


module.exports = {
  data: new SlashCommandBuilder().setName('updatepartyloot').setDescription('update party loot')
  .addStringOption(option => option.setName('campaignid').setDescription('the id of the campaign').setRequired(true))
  .addStringOption(option => option.setName('item').setDescription('the name of the item').setRequired(true))
  .addUserOption(option => option.setName('player').setDescription('the player that is currently using the checked out item.').setRequired(true))
  .addStringOption(option => option.setName('link').setDescription('a link or reference to the item')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Campaign, User } = conn.models;

    const user = await User.findOne({ discordId: interaction.user.id });
    if (!user) {
      return interaction.followUp('You do not exist in the db, please contact Beat.');
    }
    const adventure = interaction.options.getString('campaignid');
    const doc = await Campaign.findOne({ campaignId: adventure, $or: [{ gameMaster: user._id }, { players: user._id }] }).populate('characters').populate('partyLoot.character');
    const isGM = doc.gameMaster.find(x => x.toString() == user._id.toString());
    const player = interaction.options.getUser('player');
    const playerDoc = await User.findOne({ discordId: player.id })
    const item = interaction.options.getString('item');
    const link = interaction.options.getString('link');
    const loot = doc.partyLoot.find(x => x.name == item);

    if (!loot.checkedOut) {
      const character = getPlayersActiveCharacter(doc.characters, playerDoc._id);
      loot.checkedOut = true;
      loot.character = character._id;
    } else {
      if (!isGM && loot.checkedOut && interaction.user.id != player.id && loot.character.player.toString() != user._id.toString()) {
        return interaction.followUp('Only a GM or the player using the item can return the item to party loot.');
      }
      loot.checkedOut = false;
      loot.character = null;
    }

    
    if (link) {
      loot.url = link;
    }
    await doc.save();
    await interaction.followUp(`${item} has been updated.`);
  }
}