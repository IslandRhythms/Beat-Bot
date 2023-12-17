const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('removeavailability').setDescription('remove a day you\'re available.')
  .addStringOption(option => option.setName('day').setDescription('a day to remove').addChoices(
    { name: 'Monday', value: 'Monday' },
    { name: 'Tuesday', value: 'Tuesday' },
    { name: 'Wednesday', value: 'Wednesday' },
    { name: 'Thursday', value: 'Thursday' },
    { name: 'Friday', value: 'Friday' },
    { name: 'Saturday', value: 'Saturday' },
    { name: 'Sunday', value: 'Sunday' },
  )),
  async execute(interaction, conn) {
    await interaction.deferReply();

    const { User } = conn.models;

    const day = interaction.options.getString('day');

    const user = await User.findOne({ discordId: interaction.user.id });
    
  }
}