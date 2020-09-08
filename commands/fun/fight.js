const commando = require('discord.js-commando');
const weapons = ['slingshot','greatsword','bow','sword and shield','spear'];
class FightCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'fight',
            group: 'fun',
            memberName: 'fight',
            description: 'fight a monster',
            args: [
                {
                    key: 'text',
                    prompt: 'A giant approaches and wants to kill you, choose your weapon '+weapons,
                    type: 'string',
                
                }
            ]
        });
    }

    async run(message, {text}){
        if(text == 'slingshot'){
            message.reply('The giant, seeing that you are using a slingshot, laughs and walks slowly toward you and you release the rock from the slingshot and hit him directly in the temple, killing him instantly.');
        }
        else if(text == 'greatsword'){
            message.reply('You take a swing with the greatsword but miss as the weight is too much for you to handle, the giant steps on you.');
        }
        else if(text == 'bow'){
            message.reply('You take aim and fire with your bow but the giant puts his arm in front. By the time you ready your next shot he has already pulverized you.');
        }
        else if(text == 'sword and shield' || text == 'spear'){
            message.reply('you take a swing and make the giant bleed, and the giant,so angry, picks you up and yeets you across the field, instantly killing you when you hit the ground');
        }
        else{
            message.reply('Please make sure its lowercase and from the list of acceptable weapons');
        }

    }
}
module.exports = FightCommand;