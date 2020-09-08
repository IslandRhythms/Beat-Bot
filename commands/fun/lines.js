const commando = require('discord.js-commando');
const lines = require('../../lines.json');

class LineCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'lines',
            group: 'fun',
            memberName:'lines',
            description: 'get a random pick up line or send if you mention a user in the command call'
        });
    
    
    }
    async run(message, args){
        
      let input = message.content.split(/ +/);
      if(input.length > 1 && message.content.includes('<@') && message.content.includes('>')){
        for(var i = 1; i < input.length; i++){
          if(input[i].startsWith('<@') && input[i].endsWith('>'))
        message.channel.send(input[i]+lines[Math.floor(Math.random() * lines.length)]);
        }
      }
      else
        message.reply(lines[Math.floor(Math.random() * lines.length)]);
    }
}
module.exports = LineCommand;