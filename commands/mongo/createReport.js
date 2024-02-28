const { SlashCommandBuilder, 
  ActionRowBuilder, 
  ModalBuilder, 
  TextInputBuilder, TextInputStyle } = require('discord.js');


// use the modal component
module.exports = {
  data: new SlashCommandBuilder().setName('createreport').setDescription('report a bug with beat bot')
  .addAttachmentOption(option => option.setName('picture').setDescription('A screen shot of the bug if you wish to provide it.')),
  async execute(interaction, conn) {
    // await interaction.deferReply();
    const { BugReport, User } = conn.models;
    const user = await User.findOne({ discordId: interaction.user.id });
    const picture = interaction.options.getAttachment('picture') ? interaction.options.getAttachment('picture').url : null;
    const modal = new ModalBuilder().setTitle('Report Bug').setCustomId('ReportModal');
    const title = new TextInputBuilder().setCustomId(`ReportTitle`).setLabel(`Title`).setStyle(TextInputStyle.Short);
    const description = new TextInputBuilder().setCustomId(`ReportDescription`).setLabel(`Description`).setStyle(TextInputStyle.Paragraph);
    const steps = new TextInputBuilder().setCustomId(`ReportSteps`).setLabel(`Create a numbered list of steps to reproduce`).setStyle(TextInputStyle.Paragraph);
    const titleField = new ActionRowBuilder().addComponents(title);
    const descriptionField = new ActionRowBuilder().addComponents(description);
    const stepsField = new ActionRowBuilder().addComponents(steps);
    modal.addComponents(titleField, descriptionField, stepsField);
    await interaction.showModal(modal);
    await interaction.awaitModalSubmit({ time: 60_000 }).then(async (modalInteraction) => {
      await modalInteraction.reply({ content: 'Report received', ephemeral: true });
      const header = modalInteraction.fields.getTextInputValue('ReportTitle');
      const body = modalInteraction.fields.getTextInputValue('ReportDescription');
      const list = modalInteraction.fields.getTextInputValue('ReportSteps');
      const filteredlist = list.split(/\d+\.\s+/g).filter(item => item.trim() !== '');
      const reports = await BugReport.countDocuments();
      await BugReport.create({
        reporter: user._id,
        bugId: reports.toString(),
        title: header,
        description: body,
        status: 'Pending',
        stepsToReproduce: filteredlist,
        pic: picture
      });
    });
  }
}