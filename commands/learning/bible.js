
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('bible')
  .setDescription('Get a bible verse.'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const embed = new EmbedBuilder();
    const res = await axios.get('https://bible-api.com/?random=verse').then(res => res.data);
    embed.setTitle(res.text ?? `Unable to retrieve bible verse`);
    embed.setFooter({ text: 'Possible thanks to https://bible-api.com/'})
    await interaction.followUp({ embeds: [embed] })
  }
}