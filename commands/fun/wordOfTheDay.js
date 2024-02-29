const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { Pagination } = require('pagination.djs');


// use pagination here
module.exports = {
  data: new SlashCommandBuilder().setName('wordoftheday').setDescription('Gets the word of the day from dictionary.com'),
  async execute(interaction, conn) {
    await interaction.deferReply();
    const { Daily } = conn.models;
    const doc = await Daily.findOne();
    const wordOfTheDay = doc.WOTD;
    const information = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordOfTheDay}`).then(res => res.data);
    const phonetics = information[0].phonetic;
    const data = [];
    for (let i = 0; i < information.length; i++) {
      for (let index = 0; index < information[i].meanings.length; index++) {
        const obj = { partOfSpeech: '', details: '' };
        const definition = information[i].meanings[index];
        obj.partOfSpeech = definition.partOfSpeech;
        for (let j = 0; j < definition.definitions.length; j++) {
          const checkLength = obj.details + `${j+1}. ${definition.definitions[j].definition}\n${definition.definitions[j].example ? `Example Sentence: ${definition.definitions[j].example}\n` : ''}`;
          if (checkLength.length > 1024) {
            const newObj = { partOfSpeech: definition.partOfSpeech, details: obj.details, inline: true }
            data.push(newObj);
            obj.details = `${j+1}. ${definition.definitions[j].definition}\n${definition.definitions[j].example ? `Example Sentence: ${definition.definitions[j].example}\n` : ''}`; // much definition, many learning
            obj.inline = true;
          } else {
            obj.details += `${j+1}. ${definition.definitions[j].definition}\n${definition.definitions[j].example ? `Example Sentence: ${definition.definitions[j].example}\n` : ''}`; // much definition, many learning
          }
        }
        if (definition.synonyms.length) {
          const checkLength = obj.details + `Synonyms: ${definition.synonyms.join(', ')}\n`;
          if (checkLength.length > 1024) {
            const newObj = { partOfSpeech: definition.partOfSpeech, details: obj.details, inline: true }
            data.push(newObj);
            obj.details = `Synonyms: ${definition.synonyms.join(', ')}\n`
            obj.inline = true;
          } else {
            obj.details += `Synonyms: ${definition.synonyms.join(', ')}\n`
          }
        }
        if (definition.antonyms.length) {
          const checkLength = obj.details + `Antonyms: ${definition.antonyms.join(', ')}\n`;
          if (checkLength.length > 1024) {
            const newObj = { partOfSpeech: definition.partOfSpeech, details: obj.details, inline: true }
            data.push(newObj);
            obj.details = `Antonyms: ${definition.antonyms.join(', ')}\n`
            obj.inline = true;
          } else {
            obj.details += `Antonyms: ${definition.antonyms.join(', ')}\n`
          }
        }
        data.push(obj);
      }
    }
    const WOTD = new EmbedBuilder().setTitle('Word of the Day')
    .setDescription(`${wordOfTheDay} ${phonetics}`)
    .setURL('https://www.dictionary.com/e/word-of-the-day/')
    .setAuthor({ name: 'Dictionary.com', iconURL: 'https://e7.pngegg.com/pngimages/801/557/png-clipart-dictionary-com-android-mobile-phones-dictionary-blue-english.png', url: 'https://www.dictionary.com'})
    .setFooter({ text: 'Possible thanks to The free dictionary API https://dictionaryapi.dev/' });
    for (let i = 0; i < data.length; i++) {
      WOTD.addFields({ name: data[i].partOfSpeech, value: data[i].details, inline: data[i].inline });
    }
    await interaction.followUp({ embeds: [WOTD] })
  }
}