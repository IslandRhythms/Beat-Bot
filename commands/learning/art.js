const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder().setName('art').setDescription('get an artwork from the met or chicago')
  .addSubcommand(subcommand => subcommand.setName('oftheday').setDescription('get the artwork of the day'))
  .addSubcommand(subcommand => subcommand.setName('search').setDescription('look at some art with the specified theme')
    .addStringOption(option => option.setName('term').setDescription('what to search by, i.e. subject, artist, etc.').setRequired(true))),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const sub = interaction.options._subcommand;
    if (sub == 'oftheday') {
      const { Daily } = conn.models;
      const doc = await Daily.findOne().sort({ createdAt: -1 });
      const metEmbed = new EmbedBuilder()
      .setTitle(doc.artOTD.metTitle ?? `No title found`)
      .setAuthor({ name: doc.artOTD.metArtist ?? 'No artist found'})
      .setImage(doc.artOTD.metImageLink ?? `No image found`);
      const chicagoEmbed = new EmbedBuilder()
      .setTitle(doc.artOTD.chicagoTitle ?? `No title found`)
      .setAuthor({ name: doc.artOTD.chicagoArtist ?? `No artist found`})
      .setImage(doc.artOTD.chicagoImageLink ?? `No image found`)
      return interaction.followUp({ embeds: [metEmbed, chicagoEmbed] })
    } else {
      const query = interaction.options.getString('term');
      // met
      const objectIds = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isPublicDomain=true&q=${query}`).then(res => res.data);
      const selectedArtworkIndex = Math.floor(Math.random() * objectIds.total);
      const selectedArtwork = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIds.objectIDs[selectedArtworkIndex]}`).then(res => res.data);
      const embed = new EmbedBuilder()
      .setTitle(`${selectedArtwork.title}`)
      .setDescription(`${selectedArtwork.medium} ${selectedArtwork.objectDate}`)
      .setURL(`${selectedArtwork.objectURL}`)
      .setAuthor({ name: `${selectedArtwork.artistDisplayName} ${selectedArtwork.artistDisplayBio}`, /*url: `${selectedArtwork.artistWikidata_URL}`*/})
      .setImage(`${selectedArtwork.primaryImage}`)
      .setFooter({ text: 'Possible thanks to the met https://metmuseum.github.io/'});
      // chicago
      const prep = await axios.get(`https://api.artic.edu/api/v1/artworks/search?q=${query}&is_public_domain=true`).then(res => res.data);
      const page = Math.floor(Math.random() * prep.pagination.total_pages) + 1;
      const chicago = await axios.get(`https://api.artic.edu/api/v1/artworks/search?q=${query}&is_public_domain=true&page=${page}&fields=id,title,image_id`).then(res => res.data);
      const index = Math.floor(Math.random() * chicago.pagination.limit);
      const information = await axios.get(`https://api.artic.edu/api/v1/artworks/${chicago.data[index].id}`).then(res => res.data);
      const chicagoEmbed = new EmbedBuilder().setTitle(`${chicago.data[index].title}`)
      .setDescription(`${information.data.date_display}.\n ${information.data.exhibition_history ? `Shown at ${information.data.exhibition_history}\n` : ''} ${information.data.credit_line ? `Donated by ${information.data.credit_line}.` : ''}`)
      .setImage(`${chicago.config.iiif_url}/${chicago.data[index].image_id}/full/843,/0/default.jpg`)
      .setFooter({ text: 'Possible thanks to the art institute of chicago https://api.artic.edu/docs' });
      if (information.artist_titles) {
        chicagoEmbed.setAuthor({ name: information.artist_titles[0] });
      }
      return interaction.followUp({ embeds: [embed, chicagoEmbed] });
    }
  }
}