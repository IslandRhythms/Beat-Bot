const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('jumble')
    .setDescription('generates a variation of your name and also allow you to add a letter of your choice to the jumble.')
    .addStringOption(option => option.setName('name').setDescription('the name to jumble').setRequired(true).setMinLength(3))
    .addStringOption(option => option.setName('letter').setDescription('The letter to throw into the mix')),
    async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        const letter = interaction.options.getString('letter') ?? '';
        const size = name.split('');
        if (letter) {
            size.push(letter);
        }
        const jumble = size.length
        for (let i = jumble -1; i> 0; i--) {
            const position = Math.floor(Math.random() * (i + 1));
            const temp = size[i];
            size[i] = size[position];
            size[position] = temp;
        }
        const result = size.join('');
        await interaction.reply(result);
    }
}