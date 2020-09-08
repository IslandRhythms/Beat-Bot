const commando = require('discord.js-commando');

class Vote extends commando.Command{
    constructor(client){
        super(client,{
            name: 'vote',
            group: 'random',
            memberName: 'vote',
            description: 'votes on something'
        });
    }
    async run(message,args){
        var democracy = Math.floor(Math.random()*2);
        if(democracy == 0){
            message.channel.sendMessage('I vote against '+message.author);
        }
        else{
            message.channel.sendMessage('I vote with '+message.author);
        }
    }
}
module.exports = Vote;