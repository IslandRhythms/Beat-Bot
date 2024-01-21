const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('setavailable').setDescription('add a day you\'re available.')
  .addStringOption(option => option.setName('day').setDescription('a day to add').addChoices(
    { name: 'Monday', value: 'Monday' },
    { name: 'Tuesday', value: 'Tuesday' },
    { name: 'Wednesday', value: 'Wednesday' },
    { name: 'Thursday', value: 'Thursday' },
    { name: 'Friday', value: 'Friday' },
    { name: 'Saturday', value: 'Saturday' },
    { name: 'Sunday', value: 'Sunday' }
  ).setRequired(true)),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { User } = conn.models;

    const user = await User.findOne({ discordId: interaction.user.id });
    const day = interaction.options.getString('day');

    const available = user.availability.find(x => x == day);
    if (available) {
      await interaction.followUp({ content: `You've already indicated that you are available on ${day}.`, ephemeral: true });
    } else {
      user.availability.push(day);
      await user.save();
      await interaction.followUp({ content: `Set ${day} as a day you are available.`, ephemeral: true });
    }
  }
}