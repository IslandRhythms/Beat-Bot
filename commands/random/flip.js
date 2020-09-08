const commando = require('discord.js-commando');

class Flip extends commando.Command{
    constructor(client){
        super(client,{
            name: 'flip',
            group: 'random',
            memberName: 'flip',
            description: 'flip a coin'
        });

    }

    async run(message,args){
        var coin = Math.floor(Math.random() * 2);
        message.channel.sendMessage('The coin is in the air and...');
        setTimeout(myfunction,3000);
        function myfunction() {
        if(coin == 0){
            message.channel.sendMessage("It's Heads!");
        }
        else{
            message.channel.sendMessage("It's Tails!");
        }
    }
    }
}

module.exports = Flip;