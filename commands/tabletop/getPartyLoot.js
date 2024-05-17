const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('getpartyloot').setDescription('get the shared loot of the adventuring party')
  .addStringOption(option => option.setName('campaignid').setDescription('the id of your campaign.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });

    const { Campaign, User } = conn.models;
    const adventure = interaction.options.getString('campaignid');
    const user = await User.findOne({ discordId: interaction.user.id });
    if (!user) {
      return interaction.followUp('You do not exist in the db, please contact Beat.');
    }
    const userId = user._id;
    const doc = await Campaign.findOne({ campaignId: adventure, $or: [{ players: userId }, { gameMaster: userId }] }).populate('partyLoot.character');
    if (!doc) {
      return interaction.followUp(`No campaign found meeting the indicated parameters.`);
    }
    const groupName = doc.groupName ?? doc.title
    const embed = new EmbedBuilder().setTitle(`${groupName}'s shared loot.`).setThumbnail(doc.groupLogo);
    for (let i = 0; i < doc.partyLoot.length; i++) {
      const loot = doc.partyLoot[i];
      if (!doc.partyLoot[i].deletedBy) {
        embed.addFields({ name: loot.name, value: loot.url, inline: true });
        embed.addFields({ name: `Currently Used? ${loot.checkedOut}`, value: `${loot.character.name}`, inline: true });
      }
    }
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  }
}