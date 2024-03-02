const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { Pagination } = require('pagination.djs');
const shuffle = require('../../helpers/shuffle');
const he = require('he');


module.exports = {
  data: new SlashCommandBuilder().setName('trivia')
  .setDescription('Get some trivia questions and answers')
  .addNumberOption(option => option.setName('amount').setDescription('the number of questions to fetch').setMinValue(1).setMaxValue(50))
  .addStringOption(option => option.setName('difficulty').setDescription('the difficulty of questions to get').addChoices(
    { name: 'Easy', value: 'easy' },
    { name: 'Medium', value: 'medium' },
    { name: 'Hard', value: 'hard' }
  ))
  .addStringOption(option => option.setName('type').setDescription('the type of questions to get').addChoices(
    { name: 'Multiple Choice', value: 'multiple' },
    { name: 'True / False', value: 'boolean' }
  ))
  .addStringOption(option => option.setName('category').setDescription('what category to get. Omit to get questions from all categories').addChoices(
    { name: 'General', value: '9' },
    { name: 'Books', value: '10' },
    { name: 'Film', value: '11' },
    { name: 'Music', value: '12' },
    { name: 'Musicals and Theatres', value: '13' },
    { name: 'Television', value: '14' },
    { name: 'Video Games', value: '15' },
    { name: 'Board Games', value: '16' },
    { name: 'Science and Nature', value: '17' },
    { name: 'Computers', value: '18' },
    { name: 'Math', value: '19' },
    { name: 'Mythology', value: '20' },
    { name: 'Sports', value: '21' },
    { name: 'Geography', value: '22' },
    { name: 'History', value: '23' },
    { name: 'Politics', value: '24' },
    { name: 'Art', value: '25' },
    { name: 'Celebrities', value: '26' },
    { name: 'Animals', value: '27' },
    { name: 'Vehicles', value: '28' },
    { name: 'Comics', value: '29' },
    { name: 'Gadgets', value: '30' },
    { name: 'Anime and Manga', value: '31' },
    { name: 'Cartoon and Animation', value: '32' },
  )),
  async execute(interaction) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
    let amount = interaction.options.getNumber('amount') ?? 5;
    let url = `https://opentdb.com/api.php?amount=${amount}`;
    const difficulty = interaction.options.getString('difficulty');
    const category = interaction.options.getString('category');
    const type = interaction.options.getString('type');
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }
    if (category) {
      url += `&category=${category}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    const { results } = await axios.get(url).then(res => res.data);

    const embeds = [];
    for (let i = 0; i < results.length; i++) {
      const embed = new EmbedBuilder().setTitle(`${he.decode(results[i].category)} || Difficulty: ${results[i].difficulty}`).setDescription(`${he.decode(results[i].question)}`);
      if (results[i].type == 'boolean') {
        embed.addFields(
          { name: 'A', value: 'True', inline: true },
          { name: 'B', value: 'False', inline: true },
          { name: ' ', value: ' ', inline: true }, // so its two entries per line. Stupid but how it is
          { name: 'Correct Answer', value: `||The correct value is ${results[i].correct_answer == 'True' ? 'A' : 'B'}. ${results[i].correct_answer}||`}
        );
      } else {
        const answers = shuffle([...results[i].incorrect_answers, results[i].correct_answer]);
        embed.addFields(
          { name: 'A', value: he.decode(answers[0]), inline: true },
          { name: 'B', value: he.decode(answers[1]), inline: true },
          { name: ' ', value: ' ', inline: true }, // so its two entries per line. Stupid but how it is
        );
        embed.addFields(
          { name: 'C', value: he.decode(answers[2]), inline: true },
          { name: 'D', value: he.decode(answers[3]), inline: true },
          { name: ' ', value: ' ', inline: true }, // so its two entries per line. Stupid but how it is
        );
        const correctIndex = answers.indexOf(results[i].correct_answer);
        const correctLetter = String.fromCharCode(65 + correctIndex);
        embed.addFields({ name: 'Correct Answer', value: `||The correct answer is ${correctLetter}. ${he.decode(results[i].correct_answer)}||` });
      }
      embeds.push(embed);
    }
    pagination.setEmbeds(embeds, (embed, index, array) => {
      return embed.setFooter({ text: `Possible thanks to https://opentdb.com/ Page: ${index + 1}/${array.length}`})
    });
    pagination.render();
  }
}