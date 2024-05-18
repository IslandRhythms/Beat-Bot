const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('getavailability').setDescription('get a user\'s available days.')
  .addUserOption(option => option.setName('target').setDescription('the person\'s availability you wish to see.').setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { User } = conn.models;
    const target = interaction.options.getUser('target');

    const user = await User.findOne({ discordId: target.id });
    const embed = new EmbedBuilder().setTitle(`${target.username}'s Availability`)
    const days = User.schema.path('availability').options.enum;
    for (let i = 0; i < days.length; i++) {
      embed.addFields({ name: `${days[i]}`, value: `${user.availability.join(',').includes(days[i])}` })
    }
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  }
}