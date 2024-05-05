'use strict';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('smurf').setDescription('get a smurf account or update one of your smurf accounts')
  .addSubcommand(subcommand => subcommand.setName('add').setDescription('add a smurf account')
    .addStringOption(option => option.setName('accountname').setDescription('the username for the account login').setRequired(true))
    .addStringOption(option => option.setName('password').setDescription('DO NOT ADD AN ACCOUNT WITH A PASSWORD YOU USE ELSEWHERE').setRequired(true))
    .addStringOption(option => option.setName('rank').setDescription('the rank of the account').setRequired(true))
    .addStringOption(option => option.setName('game').setDescription('the game the account belongs to').addChoices(
      { name: 'Valorant', value: 'Valorant'},
      { name: 'Apex', value: 'Apex' }
    ).setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('leave empty if you want everyone to have access to this account. Otherwise, pick someone.'))
  )
  .addSubcommand(subcommand => subcommand.setName('update').setDescription('update one of your smurf accounts')
    .addStringOption(option => option.setName('id').setDescription('the discord id of the account. use \\smurf get to find it.').setRequired(true))
    .addStringOption(option => option.setName('accountname').setDescription('the username for the account login'))
    .addStringOption(option => option.setName('password').setDescription('DO NOT ADD AN ACCOUNT WITH A PASSWORD YOU USE ELSEWHERE'))
    .addStringOption(option => option.setName('rank').setDescription('the rank of the account'))
    .addStringOption(option => option.setName('game').setDescription('the game the account belongs to').addChoices(
      { name: 'Valorant', value: 'Valorant'},
      { name: 'Apex', value: 'Apex' }
    ))
    .addUserOption(option => option.setName('user').setDescription('give or remove access to/from the indicated user')))
  .addSubcommand(subcommand => subcommand.setName('remove').setDescription('remove one of your smurf accounts')
    .addStringOption(option => option.setName('id').setDescription('the id of the account. Use \\smurf get to find the correct id').setRequired(true)))
  .addSubcommand(subcomand => subcomand.setName('get').setDescription('get a smurf account')
    .addStringOption(option =>
      option.setName('game').setDescription('the game you need a smurf for')
      .addChoices(
        { name: 'Valorant', value: 'Valorant'},
        { name: 'Apex', value: 'Apex' }
      ))
    .addStringOption(option => option.setName('rank').setDescription('optional: the rank you need the account to be'))
  ),
  async execute(interaction, conn) {
    await interaction.deferReply({ ephemeral: true });
    const { User } = conn.models;
    const sub = interaction.options._subcommand;
    // this is gonna need serious work
    if (sub == 'get') {
      const owner = await User.findOne({ discordId: interaction.user.id });
      const game = interaction.options.getString('game');
      const rank = interaction.options.getString('rank');

      // Initialize the query object
      const query = { $or: [] };

      // Define conditions related to the user's accounts
      const ownerQuery = [
        { 'accounts.usersHaveAccess': interaction.user.id },
        { 'accounts.usersHaveAccess': { $exists: false } },
        { _id: owner._id },
        { 'accounts.usersHaveAccess': { $size: 0 } }
      ];

      // Add conditions to the query based on user input
      if (game) {
        query.$or.push({ 'accounts.game': game });
      }
      if (rank) {
        query.$or.push({ 'accounts.rank': rank });
      }

      // Add the owner-related conditions to the query
      query.$or.push({ $or: ownerQuery });

      // Find documents that match the constructed query
      const documents = await User.find(query);
      if (documents.length == 0) {
        return interaction.followUp(`No accounts found :(`);
      }
      const smurfData = [];
      for (let i = 0; i < documents.length; i++) {
        const accounts = documents[i].accounts.sort(function (a, b) {
          if (a.game < b.game) {
            return 1;
          } else {
            return -1;
          }
        });
        for (let index = 0; index < accounts.length; index++) {
          const dataObj = { game: '', values: [] };
          if (accounts[index].usersHaveAccess.includes(interaction.user.id) || accounts[index].usersHaveAccess.length == 0) {
            dataObj.game = accounts[index].game; // doesn't harm anything, just inefficient
            dataObj.values.push(
              { name: 'username', value: accounts[index].accountName, inline: true },
              { name: 'password', value: accounts[index].accountPassword, inline: true },
              { name: 'rank/id', value: `${accounts[index].rank} / ${accounts[index].discordAccountId}`, inline: true }
            );
            smurfData.push(dataObj);
          }
        }
      }
      // go through smurf data. If the player wants a specific game, only return accounts for that game.
      // otherwise, make a new embed for each game
      smurfData.sort(function(a,b) {
        if (a.game < b.game) {
          return 1;
        } else {
          return -1;
        }
      });
      if (game) {
        const data = smurfData.filter(x => x.game == game);
        const embed = new EmbedBuilder().setTitle(`Smurf accounts for ${game}`);
        for (let i = 0; i < data.length; i++) {
          embed.addFields(...data[i].values);
        }
        return interaction.followUp({ embeds: [embed] });
      } else {
        const embeds = [];
        let currentGame = smurfData[0].game;
        const fields = [];
        for (let i = 0; i < smurfData.length; i++) {
          if (currentGame != smurfData[i].game) {
            const embed = new EmbedBuilder().setTitle(`Smurf Accounts for ${currentGame}`);
            embed.addFields(...fields);
            fields.length = 0;
            currentGame = smurfData[i].game;
            embeds.push(embed);
          }

          fields.push(...smurfData[i].values);
          if (i === smurfData.length - 1) {
            const embed = new EmbedBuilder().setTitle(`Smurf Accounts for ${currentGame}`);
            embed.addFields(...fields);
            embeds.push(embed);
          }
        }
        return interaction.followUp({ embeds });
      }
    } else if (sub == 'add') {
      const accountName = interaction.options.getString('accountname');
      const accountPassword = interaction.options.getString('password');
      const game = interaction.options.getString('game');
      const rank = interaction.options.getString('rank');
      const user = interaction.options.getUser('user');
      const doc = await User.findOne({ discordId: interaction.user.id });
      const id = `SMURF`+ doc.accounts.length;
      const obj = { accountName, accountPassword, game, rank, discordAccountId: id }

      if (user) {
        obj.usersHaveAccess = [user.id];
      }

      doc.accounts.push(obj);
      await doc.save();
      return interaction.followUp(`smurf account ${id} has been added`)

    } else if (sub == 'remove') {
      const user = await User.findOne({ discordId: interaction.user.id });
      const id = interaction.options.getString('id');
      const account = user.accounts.find(acc => acc.discordAccountId === id);
      if (account) {
        user.accounts.pull({ discordAccountId: id });
        await user.save();
        return interaction.followUp(`Smurf Account ${id} removed successfully!`);
      } else {
        return interaction.followUp(`Smurf account not found :(`);
      }
    } else if (sub == 'update') {
      const user = await User.findOne({ discordId: interaction.user.id });
      const id = interaction.options.getString('id');
      const account = user.accounts.find(account => account.discordAccountId === id);
      if (!account) {
        return interaction.followUp(`Smurf account ${id} not found.`)
      }
  
      const usersHaveAccess = account.usersHaveAccess || [];
      const updateQuery = {};
      const entry = interaction.options.getUser('user');
      if (entry) {
        updateQuery.usersHaveAccess = usersHaveAccess.includes(entry.id)
        ? usersHaveAccess.filter(str => str !== entry.id)
        : [...usersHaveAccess, entry.id]
      }
      const accountName = interaction.options.getString('accountname');
      if (accountName) {
        updateQuery.accountName = accountName;
      }
      const accountPassword = interaction.options.getString('password');
      if (accountPassword) {
        updateQuery.accountPassword = accountPassword;
      }
      const rank = interaction.options.getString('rank');
      if (rank) {
        updateQuery.rank = rank;
      }

      const game = interaction.options.getString('game');
      if (game) {
        updateQuery.game = game;
      }

      if (Object.keys(updateQuery).length > 0) {
        console.log('what is updateQuery', updateQuery)
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: { 'accounts.$[elem]': { ...account.toObject(), ...updateQuery } } },
          { arrayFilters: [{ 'elem.discordAccountId': id }], new: true }
        );
        return interaction.followUp(`Smurf account updated!`);
      } else {
        return interaction.followUp(`Nothing provided to update, aborting ...`);
      }
  
    } else {
      return interaction.followUp('Please inform Beat what you did to get this message.')
    }
  }
}