const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { emojiCharacters } = require('../../resources/constants');


module.exports = {
  data: new SlashCommandBuilder().setName('poll').setDescription('starts a poll on the given topic')
  .addStringOption(option => option.setName('question').setDescription('the topic in the form of a question').setRequired(true))
  .addStringOption(option => option.setName('choices').setDescription('the possible choices, max 10, for the poll in the form of comma separated values'))
  .addRoleOption(option => option.setName('audience').setDescription('the people intended to respond to the poll'))
  .addBooleanOption(option => option.setName('multiple').setDescription('true to allow multiple answers. Default is no.'))
  .addNumberOption(option => option.setName('duration').setDescription('how long, in hours, the poll should remain active.')),
  async execute(interaction) {
    const message = {
      poll: {
        question: {
          text: interaction.options.getString('question')
        },
        duration: interaction.options.getNumber('duration') ?? 1, // duration in hours, minimum 1
        allowMultiselect: interaction.options.getBoolean('multiple') ?? false
      },
    }
    const choices = interaction.options.getString('choices');
    if (choices) {
      const answers = choices.split(',');
      message.poll.answers = [];
      for (let i = 0; i < answers.length; i++) {
        message.poll.answers.push({ text: answers[i].trim(), emoji: emojiCharacters[i + 1] });
      }
    } else {
      message.poll.answers = [{ text: 'Yes', emoji: `👍` }, { text: 'No', emoji: `👎`}];
    }
    console.log(message);
    let content = `Poll started by ${interaction.user.username}.`;
    if (interaction.options.getRole('audience')) {
      content += `${interaction.options.getRole('audience')}, please respond.`
    }
    content += `You have ${interaction.options.getNumber('duration') ?? 1} hour`
    await interaction.reply({ content, poll: message.poll })
  }
}