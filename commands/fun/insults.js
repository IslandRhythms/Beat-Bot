const commando = require('discord.js-commando');
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