const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder().setName('deals').setDescription('checks what featured games are currently on sale'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const res = await fetch('http://store.steampowered.com/api/featuredcategories/?cc=us&l=en').then(res => res.json());
    let dailyDeal = '';
    let queueEmbed = new EmbedBuilder()
    .setColor("#ff7373")
    .setTitle(`**Steam Deals**`);
    let str = '**Daily Deals**\n';
    queueEmbed.addFields({ name: str, value: '===================='})
    const keys = Object.keys(res);
    const categories = keys.filter(x => !Number.isNaN(parseInt(x)))
    for (let i = 0; i < categories.length; i++) {
      if (res[i].name == 'Daily Deal') {
        dailyDeal = res[i];
        dailyDeal.items.forEach(entry => {
          // str += `${entry.name}: $${entry.original_price/100} => $${entry.final_price/100} (${entry.discount_percent}% off)\nhttps://store.steampowered.com/app/${entry.id}\n`;
          queueEmbed.addFields({ name: `${entry.name}: $${entry.original_price/100} => $${entry.final_price/100} (${entry.discount_percent}% off)\n`, value: `https://store.steampowered.com/app/${entry.id}\n`})
        });
        break;
      }
    }
    // str += '**Specials**\n';
    str = '**Specials**\n';
    queueEmbed.addFields({ name: str, value: '============================='})
    // format the string
    for (let i = 0; i < res.specials.items.length; i++) {
      const game = res.specials.items[i];
      // str += `${game.name}: $${game.original_price/100} => $${game.final_price/100} (${game.discount_percent}% off)\nhttps://store.steampowered.com/app/${game.id}\n`;
      queueEmbed.addFields({ name: `${game.name}: $${game.original_price/100} => $${game.final_price/100} (${game.discount_percent}% off)`, value: `https://store.steampowered.com/app/${game.id}`})
    }
    await interaction.followUp({embeds:[queueEmbed]});
  }
}