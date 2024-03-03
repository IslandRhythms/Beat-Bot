const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { Pagination } = require('pagination.djs');
const capitalizeFirstLetter = require('../../helpers/capitalizeFirstLetter');


// use pagination here
module.exports = {
  data: new SlashCommandBuilder().setName('wordoftheday').setDescription('Gets the word of the day from dictionary.com'),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
    const { Daily } = conn.models;
    const doc = await Daily.findOne();
    const wordOfTheDay = doc.WOTD;
    const information = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordOfTheDay}`).then(res => res.data);
    const embeds = [];
    const synonyms = [];
    const antonyms = [];
    for (let i = 0; i < information.length; i++) {
      const phonetics = information[i].phonetics.map(x => x.text).join(' or ');
      for (let index = 0; index < information[i].meanings.length; index++) {
        const embed = new EmbedBuilder();
        const definitions = information[i].meanings[index].definitions;
        let description = `**${capitalizeFirstLetter(wordOfTheDay)}. ${capitalizeFirstLetter(information[i].meanings[index].partOfSpeech)}. (${phonetics})**\n`;
        synonyms.push(...information[i].meanings[index].synonyms);
        antonyms.push(...information[i].meanings[index].antonyms);
        for (let j = 0; j < definitions.length; j++) {
          description += `${j + 1}. ${definitions[j].definition} ${definitions[j].example ? `*Example:* ${definitions[j].example}` : ''}\n`;
        }
        embed.setDescription(description);
        embeds.push(embed);
      }
    }

    pagination.setEmbeds(embeds, (embed, index, array) => {
      if (synonyms.length) {
        const synonymSet = new Set(synonyms);
        embed.addFields({ name: 'Synonyms', value: [...synonymSet].join(', ') })
      }
      if (antonyms.length) {
        const antonymSet = new Set(antonyms);
        embed.addFields({ name: 'Antonym', value: [...antonymSet].join(', ') });
      }
      return embed.setTitle('Word of the Day')
      .setURL('https://www.dictionary.com/e/word-of-the-day/')
      .setAuthor({ name: 'Dictionary.com', iconURL: 'https://e7.pngegg.com/pngimages/801/557/png-clipart-dictionary-com-android-mobile-phones-dictionary-blue-english.png', url: 'https://www.dictionary.com'})
      .setFooter({ text: `Possible thanks to The free dictionary API https://dictionaryapi.dev/ Page ${index + 1} / ${array.length}` });
    });

    pagination.render();
  }
}