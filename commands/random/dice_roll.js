const commando = require('discord.js-commando');

class DiceRollCommand extends commando.Command{
constructor(client){
super(client,{
    name: 'roll',
    group: 'random',
    memberName: 'roll',
    description: 'Rolls a die you indicate',
    args: [
      {
        key: 'num',
        prompt: 'what sided die are you rolling?',
        type: 'integer',
        default: 6
      }
    ]

});
}
async run(message, {num}){
var roll = Math.floor(Math.random()*num)+1;
message.reply("You rolled a " +roll);
}
}
module.exports = DiceRollCommand;