const commando = require('discord.js-commando');
const advice = require("../../fortune-cookie.json");

class AdviceCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'fortune',
            group: 'fun',
            memberName: 'fortune',
            description: 'Get a fortune or give a fortune if you mention someone after the command call'
        });
    }

    async run(message,args){
      let input = message.content.split(/ +/);
      if(input.length > 1 && message.content.includes('<@') && message.content.includes('>')){
        for(var i = 1; i < input.length; i++){
          if(input[i].startsWith('<@') && input[i].endsWith('>'))
        message.channel.send(input[i]+advice[Math.floor(Math.random() * advice.length)]);
        }
      }
      else
        message.reply(advice[Math.floor(Math.random() * advice.length)]);
    }
    
}

module.exports = AdviceCommand;