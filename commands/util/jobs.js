const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Pagination } = require('pagination.djs');
const axios = require('axios');
const he = require('he');

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder().setName('jobs').setDescription('Search for jobs').setDMPermission(false)
  .addStringOption(option => option.setName('title').setDescription('the title of the job you are searching for').addChoices(
    { name: 'Business & Management', value: 'business' },
    { name: 'Copywriting & Content', value: 'copywriting' },
    { name: 'Customer Success', value: 'supporting' },
    { name: 'Technical Support', value: 'technical-support' },
    { name: 'Data Science', value: 'data-science' },
    { name: 'Design & Creative', value: 'design-multimedia' },
    { name: 'Web & App Design', value: 'web-app-design' },
    { name: 'DevOps & SysAdmin', value: 'admin' },
    { name: 'Engineering', value: 'engineering' },
    { name: 'Finance & Legal', value: 'accounting-finance' },
    { name: 'HR & Recruiting', value: 'hr' },
    { name: 'Marketing & Sales', value: 'marketing' },
    { name: 'Sales', value: 'seller' },
    { name: 'SEO', value: 'seo' },
    { name: 'Social Media Marketing', value: 'smm' },
    { name: 'Product & Operations', value: 'management' },
    { name: 'Programming', value: 'dev' },
    { name: 'Any', value: 'any' }
  )),
  async execute(interaction) {
    const pagination = new Pagination(interaction);
    await interaction.deferReply({ ephemeral: true });
    const title = interaction.options.getString('title');
    let url = `https://jobicy.com/api/v2/remote-jobs`;
    if (title != 'any') {
      url += `?industry=${title}`;
    }
    const { jobs } = await axios.get(url).then(res => res.data);
    if (!jobs) {
      return interaction.followUp(`No jobs found :(`);
    }
    const embeds = [];
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const embed = new EmbedBuilder()
      .setTitle(job.jobTitle)
      .setAuthor({ name: job.companyName, iconURL: job.companyLogo, url: job.url })
      .setURL(job.url)
      .setDescription(he.decode(job.jobExcerpt))
      embed.addFields(
        { name: 'Job Level', value: job.jobLevel, inline: true },
        { name: 'Location', value: job.jobGeo, inline: true },
        { name: 'Posted', value: new Date(job.pubDate).toLocaleDateString(), inline: true }
      );
      for (let index = 0; index < job.jobType.length; index++) {
        embed.addFields({ name: 'Job Type', value: job.jobType[index], inline: true });
      }
      for (let index = 0; index < job.jobIndustry.length; index++) {
        embed.addFields({ name: `Industry`, value: job.jobIndustry[index], inline: true });
      }
      if (job.salaryCurrency) {
        embed.addFields(
          { name: 'Salary Minimum', value: `${job.annualSalaryMin} ${job.salaryCurrency}`, inline: true },
          { name: 'Salary Maximum', value: `${job.annualSalaryMax} ${job.salaryCurrency}`, inline: true }
        )
      }
      embeds.push(embed);
    }
    pagination.setEmbeds(embeds, (embed, index, array) => {
      return embed.setFooter({ text: `Possible thanks to https://jobicy.com Page ${index + 1} / ${array.length}` });
    });

    pagination.render();
  }
}