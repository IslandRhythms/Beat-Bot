const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('updatepartyloot').setDescription('update party loot')
  .addStringOption(option => option.setName('campaignid').setDescription('the id of the campaign').setRequired(true))
  .addStringOption(option => option.setName('item').setDescription('the name of the item').setRequired(true))
  .addBooleanOption(option => option.setName('used').setDescription('is the item currently being used by a party member?').setRequired(true))
  .addUserOption(option => option.setName('player').setDescription('the player that is currently using the checked out item.').setRequired(true)) // change to string character name or string perhaps?
  .addStringOption(option => option.setName('link').setDescription('a link or reference to the item')),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Campaign, User } = conn.models;

    const user = await User.findOne({ discordId: interaction.user.id });
    const adventure = interaction.options.getString('campaignid');
    const doc = await Campaign.findOne({ campaignId: adventure, $or: [{ gameMaster: user._id }, { players: user._id }] }).populate('gameMaster').populate('partyLoot.character');
    const isGM = doc.gameMaster.find(x => x._id.toString() == user._id.toString());
    const player = interaction.options.getUser('player');
    const item = interaction.options.getString('item');
    const used = interaction.options.getBoolean('used');
    const link = interaction.options.getString('link');
    const loot = doc.partyLoot.find(x => x.name == item);
    if (!isGM && interaction.user.id != player.id && loot.character.player.toString() != user._id.toString()) {
      return interaction.followUp('Only a GM or the player using the item can update the item status.');
    }
    if (loot.checkedOut) {
      loot.checkedOut = used;
      if (!used) loot.character = null;
    } else {
      loot.checkedOut = used;
      if (used) {
        loot.character; // need to assign the character. How to get? 
      }
    }
    if (link) loot.url = link;

    await doc.save();
    await interaction.followUp('Under Construction');
  }
}