const commando = require('discord.js-commando');

class RecommendMoviesCommand extends commando.Command{
constructor(client){
    super(client, {
        name:'recmovies',
        group:'recommendations',
        memberName:'recmovies',
        description:'recommends different movies',
        args:[
            {
                key:'text',
                prompt:'What kind of movie you looking for? animated or live action? Please enter in lowercase letters',
                type:'string'
            }
        ]
    });
}

async run(message, {text}){
    if(text == 'animated'){
        message.reply("Super Hero: Spiderman into the spider verse is good. If you want to feel like a kid again then Christopher Robin or Incredibles 2.")
    }
    else if(text == 'live action'){
        message.reply("A classic is Good Will Hunting. Solo wasn't bad. WWII would be saving private ryan. A personal favorite is the imitation game. Can't go wrong with Marvel Movies. ")
    }
    else{
        message.reply('sorry! nothing to recommend right now...');
    }
}

}
module.exports = RecommendMoviesCommand;