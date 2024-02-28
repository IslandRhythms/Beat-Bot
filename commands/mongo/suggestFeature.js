const { SlashCommandBuilder, 
  ActionRowBuilder, 
  ModalBuilder, 
  TextInputBuilder, TextInputStyle } = require('discord.js');


// use the modal component
module.exports = {
  data: new SlashCommandBuilder().setName('suggestfeature').setDescription('suggest a feature for Beat Bot')
  .addAttachmentOption(option => option.setName('picture').setDescription('A picture of what you want the feature to look like.')),
  async execute(interaction, conn) {
    const { BugReport, User } = conn.models;
    const user = await User.findOne({ discordId: interaction.user.id });
    const picture = interaction.options.getAttachment('picture') ? interaction.options.getAttachment('picture').url : null;
    const modal = new ModalBuilder().setTitle('Suggest Feature').setCustomId('SuggestModal');
    const title = new TextInputBuilder().setCustomId(`SuggestTitle`).setLabel(`Title`).setStyle(TextInputStyle.Short);
    const description = new TextInputBuilder().setCustomId(`SuggestDescription`).setLabel(`Description`).setStyle(TextInputStyle.Paragraph);
    const titleField = new ActionRowBuilder().addComponents(title);
    const descriptionField = new ActionRowBuilder().addComponents(description);
    modal.addComponents(titleField, descriptionField);
    await interaction.showModal(modal);
    await interaction.awaitModalSubmit({ time: 60_000 }).then(async (modalInteraction) => {
      await modalInteraction.reply({ content: 'Suggestion received', ephemeral: true });
      const header = modalInteraction.fields.getTextInputValue('SuggestTitle');
      const body = modalInteraction.fields.getTextInputValue('SuggestDescription');
      const reports = await BugReport.countDocuments();
      await BugReport.create({
        reporter: user._id,
        bugId: reports.toString(),
        status: 'Feature Request',
        title: header,
        description: body,
        pic: picture
      });
    });
  }
}