const { SlashCommandBuilder } = require('discord.js');
const wiki = require('wikipedia');
// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=addMentionableOption

module.exports = {
  data: new SlashCommandBuilder().setName('onthisday')
  .setDescription('Tells what historical event happened today. Can narrow down scope with arguments.')
  .addStringOption(option => option.setName('type').setDescription('what events to look for.')
  .addChoices(
    { name: 'all', value: 'all' },
    { name: 'selected (Don\'t know what this means)', value: 'selected' },
    { name: 'births', value: 'births' },
    { name: 'deaths', value: 'deaths' },
    { name: 'events', value: 'events' },
    { name: 'holidays', value: 'holidays' },
  ))
  .addNumberOption(option => option.setName('month').setDescription('The number of the month (1 (January), 2, 3 ...)').setMaxValue(12).setMinValue(1))
  .addNumberOption(option => option.setName('day').setDescription('The day of the month (1, 2, 3 ...)').setMaxValue(31).setMinValue(1)),
  async execute(interaction) {
    await interaction.deferReply();
    const type = interaction.options.getString('type');
    const month = interaction.options.getNumber('month');
    const day = interaction.options.getNumber('day');
    const events = await wiki.onThisDay({ type, month, day });
    // https://github.com/dopecodez/wikipedia/blob/master/docs/resultTypes.md#eventResult
    const choices = Object.keys(events);
    const index = Math.floor(Math.random() * choices.length);
    const selectedArray = events[choices[index]];
    const onThisDayIndex = Math.floor(Math.random() * selectedArray.length);
    if(!selectedArray[onThisDayIndex]) {
      return interaction.followUp(`Please ensure you've entered a valid date and try again`)
    }
    const pageEntry = selectedArray[onThisDayIndex].pages[0];
    // desktop link: ${pageEntry.content_urls.desktop.page}
    const str = `
    For ${choices[index]} on this day, ${selectedArray[onThisDayIndex].year ? `in the year ${selectedArray[onThisDayIndex].year},` : ''} ${selectedArray[onThisDayIndex].text}
    link: ${pageEntry.content_urls.mobile.page}
    `;
    await interaction.followUp(str);
  }
}