const commando = require('discord.js-commando');

class RecommendShowsCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'recshows',
            group: 'recommendations',
            memberName: 'recshows',
            description: 'recommends shows that I think are good',
            args: [
                {
                    key:'text',
                    prompt: 'american,anime, or spanish/catalan? Please enter in lowercase letters',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, {text}){
        if(text == 'american'){
            message.reply('Any super hero show on netflix. If you want a non super hero show then Burn Notice. A comedy that my parents like is Schitts creek. Historical would be Turn:washingtons spies. Political would be Designated Survivor.');
        }

        else if(text == 'anime'){
            message.reply("Comedy: if you want superhero theme then one punch man, regular comedy is Saikik. Medieval fantasy: 7 deadly sins. Ninjas: Naruto shippuden. Futuristic Gaming: Sword Art Online(Note that gun gale online isn't the best but it gets better). Super Hero: Boku No My Hero Academia.");
        }

        else if(text == "spanish/catalan"){
            message.reply("Merli is a good show but be warned that the language is catalan with english subtitles but if you speak spanish you can switch the audio to that. Season 1 is on netflix and if you want to watch the other seasons you'll have to switch your region in netflix.")
        }
        else{
            message.reply('No recommendations right now but if you have something in mind let Daniel know!');
        }

    }



}
module.exports = RecommendShowsCommand;