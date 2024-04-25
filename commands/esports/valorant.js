const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('valorant')
  .setDescription('Get valorant esports related information')
  .addSubcommandGroup(option => option.setName('match').setDescription('match')
    .addSubcommand(subcommand => subcommand.setName('upcoming').setDescription('get the upcoming valorant match'))
    .addSubcommand(subcommand => subcommand.setName('live_score').setDescription('Get the in progress match'))
    .addSubcommand(subcommand => subcommand.setName('results').setDescription('get the results of the most recent match')))
  .addSubcommand(subcommand => subcommand.setName('news').setDescription('get the most recent valorant news')),
  async execute(interaction) {
    await interaction.deferReply();
    const subcommand = interaction.options._subcommand;
    const group = interaction.options._group;
    let embed = null;
    if (subcommand == 'news') {
      const { data } = await axios.get(`https://vlrggapi.vercel.app/${subcommand}`).then(res => res.data);
      const information = data.segments[0];
      embed = new EmbedBuilder().setTitle(`${information.title}`)
      .setURL(`${information.url_path}`)
      .setDescription(`${information.description}`)
      .setTimestamp(new Date(information.date))
      .setAuthor({ name: `${information.author}` });
    } else {
      console.log('what is interaction', interaction.options);
      const { data } = await axios.get(`https://vlrggapi.vercel.app/${group}/${subcommand}`).then(res => res.data);
      const information = data.segments[0];
      console.log('what is information', information);
      if (subcommand == 'upcoming') {

      } else if (subcommand == 'live_score') {

      } else if (subcommand == 'results') {
        
      }
    }

    if (embed) {
      embed.setFooter({ text: 'Possible in part to https://www.vlr.gg/ and https://vlrggapi.vercel.app/#/' });
      return interaction.followUp({ embeds: [embed] })
    } else {
      return interaction.followUp(`Unable to complete request at this time`);
    }
  }
}