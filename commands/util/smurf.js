const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder().setName('smurf').setDescription('get a smurf account or update one of your smurf accounts')
  .addSubcommand(subcommand => subcommand.setName('add').setDescription('add a smurf account')
    .addStringOption(option => option.setName('accountname').setDescription('the username for the account login').setRequired(true))
    .addStringOption(option => option.setName('password').setDescription('DO NOT ADD AN ACCOUNT WITH A PASSWORD YOU USE ELSEWHERE').setRequired(true))
    .addStringOption(option => option.setName('rank').setDescription('the rank of the account').setRequired(true))
    .addStringOption(option => option.setName('game').setDescription('the game the account belongs to').setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('leave empty if you want everyone to have access to this account. Otherwise, pick yourself or someone.'))
  )
  .addSubcommand(subcommand => subcommand.setName('update').setDescription('update one of your smurf accounts')
    .addStringOption(option => option.setName('accountname').setDescription('the username for the account login'))
    .addStringOption(option => option.setName('password').setDescription('DO NOT ADD AN ACCOUNT WITH A PASSWORD YOU USE ELSEWHERE'))
    .addStringOption(option => option.setName('rank').setDescription('the rank of the account'))
    .addStringOption(option => option.setName('game').setDescription('the game the account belongs to'))
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
    if (sub == 'get') {

    } else if (sub == 'add') {
      const accountName = interaction.options.getString('accountname');
      const accountPassword = interaction.options.getString('accountpassword');
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

    } else if (sub == 'update') {

    } else {
      return interaction.followUp('Please inform Beat what you did to get this message.')
    }
    await interaction.followUp(`Under Construction`);
  }
}