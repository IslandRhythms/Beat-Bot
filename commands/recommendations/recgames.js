const commando = require('discord.js-commando');
const generes = ['shooter','strategy','casual','mmo','br','story driven','fighter','open world','challenge'];
class RecommendGamesCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'recgames',
            group: 'recommendations',
            memberName: 'recgames',
            description: 'recommends games I think are fun to play.',
            args: [
                {
                    key:'text',
                    prompt: 'What kind of game are you in the mood for? Please enter in lowercase letters ' + generes,
                    type: 'string',
                }
            ]
        });
    }


   async run(message,{ text }){
        if(text == 'shooter'){
            message.reply('Rainbow six siege is really fun but expect to carry the team, planetside 2 is also fun and free to play. Imagine Battlefield 4 but on a much much larger scale.');
        }
        else if(text == 'strategy'){
            message.reply('Civilization Revolution VI is pretty fun. I lose a bunch but I still enjoy it. If you want something space themed that is not star wars then executive assault 2 is good.'+
             'The game has a overview view but '+
            'you can also control individual units. It is early access and the devs are continuing to work on it so if you like how it is now imagine when it is finished. '+
            'If you want star wars then empire at war, has clones wars sage mod too if you do not like that era.');

        }
       else  if(text == 'casual'){
            message.reply('a really fun game that if you just want to chill is one finger death punch 2. The animations are really what make the game fun. Single player.');
        }
        else if(text == 'mmo'){
            message.reply("Warframe if you wanna be a space ninja, DC universe online if you wanna be a superhero or villain. Conqueror's blade looks interestng but only time will tell. "+
            "Imagine hyrule warriors but you also control some of the AI troops and you fight other hyrule warriors and their AI troops. ");
        }
       else if(text == 'br'){
            message.reply("fortnite is too sweaty, PUBG is ok, Apex is free but its virtually impossible to clutch. Battlefield V has a BR too but $60 to play.");
        }
        else if(text == 'story driven'){
            message.reply("PS4: Spider-man, PC: Final Fantasy 15. It also has a multiplayer mode which is pretty fun.")
        }
        else if(text == 'fighter'){
            message.reply('smash');
        }
        else if(text == 'open world'){
            message.reply('Breath of the Wild, 8/10');
        }
       else if(text == 'challenge'){
            message.reply("Wizard of Legend is really fun. Will definetly keep you entertained.");
        }
        else{
            message.reply("Nothing to recommend for that type yet but if you have something in mind let Daniel know!");
        }
    }

}

module.exports = RecommendGamesCommand;