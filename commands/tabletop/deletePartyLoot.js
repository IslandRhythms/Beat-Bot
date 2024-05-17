const { SlashCommandBuilder } = require('discord.js');
const getPlayersActiveCharacter = require('../../helpers/getPlayersActiveCharacter');


module.exports = {
  data: new SlashCommandBuilder().setName('deletepartyloot').setDescription('delete an item from the party loot')
  .addStringOption(option => option.setName('campaignid').setDescription('the id of your campaign.').setRequired(true))
  .addStringOption(option => option.setName('item').setDescription('the name of the item').setRequired(true))
  .addUserOption(option => option.setName('player').setDescription('the player that is currently using the checked out item.')),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { Campaign, User } = conn.models;
    const adventure = interaction.options.getString('campaignid');
    const user = await User.findOne({ discordId: interaction.user.id });
    if (!user) {
      return interaction.followUp('You do not exist in the db, please contact Beat.');
    }
    const doc = await Campaign.findOne({ campaignId: adventure, $or: [{ players: user._id }, { gameMaster: user._id }] }).populate('characters').populate('partyLoot.character');
    if (!doc) {
      return interaction.followUp(`No campaign found meeting the indicated parameters.`);
    }
    const item = interaction.options.getString('item');
    const isGM = doc.gameMaster.find(x => x.toString() == user._id.toString());

    const entry = doc.partyLoot.find(x => x.name == item);
    if (entry.deletedBy) {
      return interaction.followUp(`Item has already been deleted by ${entry.deletedBy}`)
    }
    const player = interaction.options.getUser('player');
    if (entry.checkedOut && (!player || player.id != interaction.user.id) && !isGM) {
      return interaction.followUp('If an item is being used by someone and you are not a GM, you must provide who.');
    }


    if (entry && !entry.checkedOut) {
      doc.partyLoot.find(x => x.name == item).deletedBy = interaction.user.id;
    } else if (entry.checkedOut) {
      const playerDoc = await User.findOne({ discordId: player.id });
      const character = getPlayersActiveCharacter(doc.characters, playerDoc._id);
      if (!character) {
        return interaction.followUp('No character found.');
      }
      doc.partyLoot.find(x => x.name == item).deletedBy = interaction.user.id;
    } else {
      return interaction.followUp('loot item not found in party loot.')
    }
    await doc.save();
    await interaction.followUp(`Removed ${item} from party loot.`);
  }
}