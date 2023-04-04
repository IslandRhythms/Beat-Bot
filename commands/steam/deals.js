const { SlashCommandBuilder } = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder().setName('deals').setDescription('checks what featured games are currently on sale'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const res = await fetch('http://store.steampowered.com/api/featuredcategories/?cc=us&l=en').then(res => res.json());
    console.log('what is res', res);
    let dailyDeal = '';
    let str = '**Daily Deals**\n';
    const keys = Object.keys(res);
    const categories = keys.filter(x => !Number.isNaN(parseInt(x)))
    for (let i = 0; i < categories.length; i++) {
      if (res[i].name == 'Daily Deal') {
        dailyDeal = res[i];
        dailyDeal.items.forEach(entry => {
          str += `${entry.name}: $${entry.original_price/100} => $${entry.final_price/100} (${entry.discount_percent}% off)\nhttps://store.steampowered.com/app/${entry.id}\n`;
        });
        break;
      }
    }
    console.log('what is res.specials.items', res.specials.items);
    str += '**Specials**\n';
    // format the string
    for (let i = 0; i < res.specials.items.length; i++) {
      const game = res.specials.items[i];
      str += `${game.name}: $${game.original_price/100} => $${game.final_price/100} (${game.discount_percent}% off)\nhttps://store.steampowered.com/app/${game.id}\n`;
    }
    await interaction.followUp(str)
  }
}