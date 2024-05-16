const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Pagination } = require('pagination.djs');

// how do we display multiple?
module.exports = {
  data: new SlashCommandBuilder().setName('getcharacter')
  .setDescription('get all of your character ids. Provide an id or name to get a specific one')
  .addStringOption(option => option.setName('characterid').setDescription('the id of your character'))
  .addStringOption(option => option.setName('name').setDescription('the name of your character')),
  async execute(interaction, conn) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
    const { User, Character } = conn.models;

    const user = await User.findOne({ discordId: interaction.user.id });
    const query = { player: user._id };
    const characterId = interaction.options.getString('characterid');
    const name = interaction.options.getString('name');
    if (characterId) {
      query.characterId = characterId;
    }
    if (name) {
      query.name = name;
    }
    const characters = await Character.find(query);
    const embeds = [];
    if (characters.length > 1) {
      const embed = new EmbedBuilder().setTitle('Your character names and ids');
      for (let i = 0; i < characters.length; i++) {
        embed.addFields({ name: characters[i].name, value: characters[i].characterId });
      }
      embeds.push(embed);
      return interaction.followUp({ embeds, ephemeral: true });
    } else {
      const character = characters[0];
      const embed = new EmbedBuilder().setTitle(`${character.name}`);
      embed.setDescription(character.backStory)
      embed.addFields({ name: 'Adventuring Group', value: character.groupName, inline: true });
      embed.addFields({ name: 'Alive?', value: character.isAlive, inline: true });
      embed.addFields({ name: 'Retired?', value: character.isRetired, inline: true });
      embed.addFields({ name: 'Hero?', value: character.isHero, inline: true });
      embed.addFields({ name: 'Background', value: character.background, inline: true });
      embed.addFields({ name: 'Race', value: character.race, inline: true });
      embed.addFields({ name: 'Alignment', value: character.alignment, inline: true });
      embed.addFields({ name: 'Trait', value: character.trait, inline: true });
      embed.addFields({ name: 'Ideal', value: character.ideal, inline: true });
      embed.addFields({ name: 'Bond', value: character.bond, inline: true });
      embed.addFields({ name: 'Flaw', value: character.flaw, inline: true });
      embed.addFields({ name: 'System', value: character.system, inline: true });
      if (character.isMulticlass) {
        const classEmbed = new EmbedBuilder().setTitle(`${character.name} Multiclass breakdown`);
        for (let i = 0; i < character.classes.length; i++) {
          classEmbed.addFields({ name: 'Class', value: `${character.classes[i].name} ${character.classes[i].level}` });
        }
        embeds.push(classEmbed);
      } else {
        embed.addFields({ name: 'Class', value: character.classes[0].name });
      }
      embeds.push(embed);
      const statEmbed = new EmbedBuilder().setTitle(`${character.name} Stats and Feats`);
      statEmbed.addFields({ name: 'HP', value: character.totalHP, inline: true });
      statEmbed.addFields({ name: 'Level', value: character.totalLevel, inline: true });
      statEmbed.addFields({ name: 'XP', value: character.XP, inline: true });
      const keys = Object.keys(character.stats);
      for (let i = 0; i < keys.length; i++) {
        statEmbed.addFields({ name: keys[i], value: `${character.stats[keys[i]].modifier}/${character.stats[keys[i]].score}`, inline: true });
      }
      for (let i = 0; i < character.feats.length; i++) {
        statEmbed.addFields({ name: 'Feat', value: character.feats[i], inline: true });
      }
      embeds.push(statEmbed);

      if (character.epilogue) {
        const epilogueEmbed = new EmbedBuilder().setTitle(`${character.name} Epilogue`).setDescription(character.epilogue);
        embeds.push(epilogueEmbed);
      } else if (character.causeOfDeath) {
        const deathEmbed = new EmbedBuilder().setTitle(`${character.name} Cause of Death`).setDescription(character.causeOfDeath);
        embeds.push(deathEmbed);
      }

      pagination.setEmbeds(embeds, (currentEmbed, index, array) => {
        if (character.characterImage) {
          currentEmbed.setThumbnail(character.characterImage);
        }
        return currentEmbed.setFooter({ text: `Character Id ${character.characterId}`});
      });
  
      pagination.setOptions({ ephemeral: true });
  
      return pagination.render();
    }
  }
}