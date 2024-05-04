require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('plant')
  .setDescription('Get more information on the plant of the day.'),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const { Daily } = conn.models;
    const doc = await Daily.findOne().sort({ createdAt: -1 });
    const data = await axios.get(`https://perenual.com/api/species/details/${doc.plantOTD.id}?key=${process.env.PLANTAPIKEY}`).then(res => res.data);
    const embed = new EmbedBuilder()
      .setTitle(`${data.scientific_name[0]}, commonly known as ${data.common_name}`)
      .setDescription(`Also known as ${data.other_name.join(',')}. ${data.description}`)
      .setImage(data.default_image.original_url)
      .addFields(
        { name: 'Plant Type', value: data.type, inline: true },
        { name: 'Edibile Fruit', value: data.edible_fruit, inline: true },
        { name: 'Attracts', value: data.attracts.join(','), inline: true },
        { name: 'Poisonous to Humans', value: data.poisonous_to_humans, inline: true },
        { name: 'Poisonous to Pets', value: data.poisonous_to_pets, inline: true },
        { name: 'Medical', value: data.medicinal, inline: true },
        { name: 'Rare', value: data.rare, inline: true },
        { name: 'Cuisine', value: data.cuisine, inline: true },
        { name: 'Maintenance', value: data.maintenance, inline: true },
        { name: 'Indoor', value: data.indoor, inline: true },
        { name: 'Tropical', value: data.tropical, inline: true },
        { name: 'Thorny', value: data.thorny, inline: true }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}