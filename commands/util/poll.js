const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('poll').setDescription('starts a poll on the given topic')
  .addStringOption(option => option.setName('question').setDescription('the topic in the form of a question').setRequired(true))
  .addStringOption(option => option.setName('choices').setDescription('the possible choices, max 20, for the poll in the form of comma separated values'))
  .addRoleOption(option => option.setName('audience').setDescription('the people intended to respond to the poll')),
  async execute(interaction) {
    await interaction.deferReply();
    let question = interaction.options.getString('question');
    if (!question.endsWith('?')) {
      question = question + '?'
    }
    const choices = interaction.options.getString('choices');
    const audience = interaction.options.getRole('audience') ?? '';
    let queueEmbed = new EmbedBuilder().setColor("#ff7373").setTitle('📊 '+ question);
    if (!choices) {
      await interaction.followUp({ content: audience, embeds: [queueEmbed] });
      const msg = await interaction.fetchReply();
      await msg.react('👍');
      await msg.react('👎');
    } else {
      const options = choices.split(',');
      const numLoops = options.length > 20 ? 20: options.length;
      const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
            '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
      for (let i = 0; i < numLoops; i++) {
        queueEmbed.addFields({ name: alphabet[i] + ' ' + options[i], value: ' ', inline: true });
      }
      const msg = await interaction.followUp({ embeds: [queueEmbed] });
      for (let i = 0; i < numLoops; i++) {
        await msg.react(alphabet[i])
      }
    }
    
  }
}