const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getDiscordAvatar = require('../../helpers/getDiscordAvatar');
const getUserFromInteraction = require('../../helpers/getUserFromInteraction');
const { Pagination } = require('pagination.djs');


module.exports = {
  data: new SlashCommandBuilder().setName('getadventures')
  .setDescription('get all recorded adventures on the server')
  .addUserOption(option => option.setName('author').setDescription('get all adventures created by the indicated user')),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });

    const { Adventure, User } = conn.models;
    const author = interaction.options.getUser('author');
    let adventures = null;
    if (author) {
      const authorDoc = await User.findOne({ discordId: author.id });
      if (authorDoc) {
        adventures = await Adventure.find({ designer: authorDoc._id }).populate('designer');
      } else {
        return interaction.followUp(`This user has no adventures attributed to them.`)
      }
    } else {
      adventures = await Adventure.find().populate('designer');
    }

    const embeds = [];
    if (adventures.length == 0) {
      return interaction.followUp('No adventures could be found :(. Try creating one and spread the fun!')
    }
    else if (adventures.length > 10) {
      let maxFields = 0;
      let embed = new EmbedBuilder();
      for (let i = 0; i < adventures.length; i++) {
        if (maxFields > 25) {
          embeds.push(embed);
          maxFields = 0;
          embed = new EmbedBuilder();
        }
        const discordUser = getUserFromInteraction(interaction, adventures[i].designer.discordId)
        embed.addFields({ name: discordUser.username, value: adventures[i].url ?? adventures[i].document });
        maxFields++;
      }
      if (maxFields > 0) {
        embeds.push(embed);
      }
    } else {

      for (let i = 0; i < adventures.length; i++) {
        const discordUser = await getUserFromInteraction(interaction, adventures[i].designer.discordId);
        const discordPic = getDiscordAvatar(discordUser);
        const embed = new EmbedBuilder()
        .setAuthor({ name: discordUser.user.username, iconURL: discordPic })
        .setTitle(`${adventures[i].title}`)
        .setDescription(`${adventures[i].description}`)
        if (adventures[i].picture) {
          embed.setImage(`${adventures[i].picture}`);
        }
        if (adventures[i].url) {
          embed.setURL(adventures[i].url)
        } else {
          embed.setURL(adventures[i].document)
        }
        embeds.push(embed);
      }
    }
    pagination.setEmbeds(embeds, (currentEmbed, index, array) => {
      return currentEmbed.setFooter({ text: new Date().toLocaleDateString() });
    });
    pagination.setOptions({ ephemeral: true })
    return pagination.render();
  }
}