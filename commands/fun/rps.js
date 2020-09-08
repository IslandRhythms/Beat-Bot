const commando = require('discord.js-commando');

class RPS extends commando.Command{
    constructor(client){
        super(client,{
            name: 'rps',
            group: 'fun',
            memberName: 'rps',
            description: 'play rock paper scissors with the bot',
            args:[
                {
                    key: 'text',
                    prompt: "Alrighty pick rock paper or scissors. Don't worry, my eyes are closed.",
                    type: 'string',
                    oneOf: ['rock','paper','scissors','Rock','Paper','Scissors'],
                    error: 'what game are you playing?'
                    
                    
                    
                }
            ]
        });
    }

    async run(message, {text}){
        var choice = Math.floor(Math.random()*3)+1;
        if(choice == 1 && (text == 'paper'|| text == 'Paper')){
            message.reply("I chose rock :( You win... ");
        }
        if(choice == 1 && (text == 'scissors'|| text == 'Scissors')){
            message.reply("I chose rock! I win!");
        }
        if(choice == 2 && (text == 'scissors'|| text == 'Scissors')){
            message.reply("I chose paper :( You win...");
        }
        if(choice == 2 && (text == 'rock'|| text == 'Rock')){
            message.reply("I chose paper! I win!");
        }
        if(choice == 3 && (text == 'rock'|| text == 'Rock')){
            message.reply("I chose scissors :( You win...");
        }
        if(choice == 3 && (text == 'paper'|| text == 'Paper')){
            message.reply("I chose scissors! I win!");
        }
        else
        message.reply("It's a draw!");

    }
}
module.exports = RPS;