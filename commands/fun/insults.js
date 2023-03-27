const { SlashCommandBuilder } = require('discord.js');
const insult = require('../../insults.json');

class InsultsCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'burn',
            group: 'fun',
            memberName: 'burn',
            description: 'Sends a sick burn and will burn users if mentioned in the command call'
        });
    }

    async run(message, args){
      let input = message.content.split(/ +/);
      if(input.length > 1 && message.content.includes('<@') && message.content.includes('>')){
        for(var i = 1; i < input.length; i++){
          if(input[i].startsWith('<@') && input[i].endsWith('>'))
        message.channel.send(input[i]+insult[Math.floor(Math.random() * insult.length)]);
        }
      }
      else
        message.reply(insult[Math.floor(Math.random() * insult.length)]);
    }
}
module.exports = InsultsCommand;

module.exports = {
  data: new SlashCommandBuilder().setName('burn').setDescription('Sends a sick burn and will burn a user if mentioned in the command call').addUserOption(option => option.setName('target').setDescription('the user to burn')),
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('target') ?? '';
    const burn = insult[Math.floor(Math.random() * insult.length)];
    if (user) {
      interaction.channel.send(`@${user.username} ${burn}`);
    } else {
      interaction.reply(`${burn}`)
    }
  }
}