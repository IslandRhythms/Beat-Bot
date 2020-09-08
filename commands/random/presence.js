const commando = require('discord.js-commando');
const index = require('../../index.js');
class Status extends commando.Command{
    
constructor(client){
   
    super(client,{
        name: 'presence',
        group: 'random',
        memberName:'presence',
        description:'Tells the command caller if I am actually there while logged on discord'
    });
}
async run(message,args){
    var activity = ["Ready to play","Chilling","Doing work","afk","can talk"];
       message.reply(activity[index.info]);
       
   

}

}
module.exports = Status;