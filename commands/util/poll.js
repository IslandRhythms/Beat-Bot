const { SlashCommandBuilder } = require('discord.js');
const sleep = require('../../helpers/sleep');

const { emojiCharacters } = require('../../resources/constants');


module.exports = {
  data: new SlashCommandBuilder().setName('poll').setDescription('starts a poll on the given topic')
  .addStringOption(option => option.setName('question').setDescription('the topic in the form of a question').setRequired(true))
  .addStringOption(option => option.setName('choices').setDescription('the possible choices, max 10, for the poll in the form of comma separated values'))
  .addRoleOption(option => option.setName('audience').setDescription('the people intended to respond to the poll'))
  .addBooleanOption(option => option.setName('multiple').setDescription('true to allow multiple answers. Default is no.'))
  .addNumberOption(option => option.setName('duration').setDescription('how long, in hours, the poll should remain active.')),
  async execute(interaction, conn) {
    const { Poll, User } = await conn.models;
    const user = await User.findOne({ discordId: interaction.user.id });
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
    let content = `Poll started by ${interaction.user.username}.`;
    if (interaction.options.getRole('audience')) {
      content += `${interaction.options.getRole('audience')}, please respond.`
    }
    content += `You have ${interaction.options.getNumber('duration') ?? 1} hour`
    const client = await interaction.reply({ content, poll: message.poll });
    const sent = await interaction.fetchReply();
    const isBinary = message.poll.answers.length > 2 ? false : true;
    await Poll.create({
      messageLink: `discord.com/channels/${sent.guildId}/${sent.channelId}/${sent.id}`,
      messageId: sent.id,
      target: `${interaction.options.getRole('audience') ? interaction.options.getRole('audience').id : ''}`,
      isBinary, 
      question: message.poll.question.text,
      guildId: `${sent.guildId}`,
      pollster: {
        discordId: interaction.user.id,
        mongooseId: user._id
      }
    });
    // const channel = client.interaction.client.channels.cache.get(interaction.channelId)
    // console.log('what is channel', channel);
    // await sleep(3000);
    // await channel.messages.endPoll(sent.id)
  }
}