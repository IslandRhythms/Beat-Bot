const { SlashCommandBuilder } = require('discord.js');

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

module.exports = {
  data: new SlashCommandBuilder().setName('GuessTheNumber')
  .setDescription('Beat Bot is thinking of a number, 1-10. Can you guess?')
  .addIntegerOption(option => option.setName('guess')
  .setDescription("User's guess")
  .setRequired(true)
  .setMaxValue(10)
  .setMinValue(1)),
  async execute(interaction) {
    const userGuess = interaction.options.getInteger('guess');
    const answer =  Math.floor(Math.random()*10)+1;
    if (userGuess == answer) {
        await interaction.reply("You're Correct!");
    } else {
        await interaction.reply(`Nope. My number was ${answer}`);
    }
  }
}