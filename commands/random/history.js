const commando = require('discord.js-commando');

class History extends commando.Command{
    constructor(client){
        super(client,{
            name: 'joined',
            group: 'random',
            memberName: 'joined',
            description: 'tells user when they joined the server'
        });
    }
    async run(message){
        await message.channel.send('You joined on: ' + new Date(message.guild.joinedAt).toLocaleDateString()
        + ' at '+ new Date(message.guild.joinedAt).toLocaleTimeString());
    }
}
module.exports = History;