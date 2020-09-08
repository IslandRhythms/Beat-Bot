const commando = require('discord.js-commando');

class NumberGame extends commando.Command{
    constructor(client){
        super(client, {
            name: 'number',
            group: 'fun',
            memberName:'number',
            description: 'Try to guess the number the bot is thinking of.',
            args:[
                {
                    key: 'num',
                    prompt: 'I am thinking of a number 1 - 10. What number am I thinking of?',
                    type:'string'

                }
            ]
        });
    }

        async run(message,{num}){
            var answer = Math.floor(Math.random()*10)+1;
            if(answer == num){
                message.reply("You're Correct!");
            }
            else{
                message.reply("Nope, it was "+answer);
            }

        }


}
module.exports = NumberGame;