const commando = require('discord.js-commando');

class NameGenerator extends commando.Command{
    constructor(client){
        super(client, {
            name: 'generate',
            group: 'fun',
            memberName: 'generate',
            description: 'generates a variation of your name and also allow you to add a letter of your choice to the jumble.',
            args:[
                {
                    key: 'text',
                    prompt:'If you would like to add a letter to jumble the name, please enter that letter now. Otherwise type no',
                    type: 'string',
                    validate: text => text.length < 3,
                },
                {
                    key: 'name',
                    prompt: 'what name would you like to jumble?',
                    type: 'string'
                }
            ]
        });
    }


    async run(message,{text,name}){

        if(text == 'no'){
            var size = name.split("");
            var jumble = size.length;
            for(var i = jumble - 1; i > 0; i--){
                var pos = Math.floor(Math.random() * (i+1));
                var temp = size[i];
                size[i] = size[pos];
                size[pos] = temp;
            }
            message.reply(size.join(""));
            
        }
        else {

        var size = name.split("");
        size.push(text);
        var jumble = size.length;
        for(var i = jumble - 1; i > 0; i--){
            var pos = Math.floor(Math.random() * (i + 1));
            var temp = size[i];
            size[i] = size[pos];
            size[pos] = temp;
        }
        message.reply(size.join(""));
        }
        
    }
}
module.exports = NameGenerator;