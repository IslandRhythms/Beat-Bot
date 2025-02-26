# Beat-Bot

fun bot with music functionality

Built on windows 10.
Currently running on a raspberry pi.
A problem encountered when moving to the raspberry pi was running npm install to download the modules onto the pi cause the bot to no longer work.
The solution to this was that when moving the bot to include the modules. If you encounter this problem just download the modules on your machine and then move it all together to the pi.


Helpful links
link to arg passed to the execute functions: https://discord.js.org/#/docs/discord.js/main/class/CommandInteraction

link to discord player highlights https://discord-player.js.org/docs/guides/migrating

link to the pagination library documentation https://pagination-djs.js.org/

link to discord image references https://discord.com/developers/docs/reference#image-formatting


Add sudo infront of the npm script values so it can write files

To setup in pm2:
pm2 start npm --name "my-app-name" -- run "npm:script"

Ex: pm2 start npm --name "myApp" -- run "start:production"
