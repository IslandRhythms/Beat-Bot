'use strict';
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { sendMessageToEsports, sendMessageToTest } = require('../helpers/sendMessageTo');

module.exports = async function valorantMatchesOfTheDay(bot) {
  try {
    const { data } = await axios.get(`https://vlrggapi.vercel.app/match?q=upcoming`).then(res => res.data);
    const matches = data.segments.sort((a, b) => a.unix_timestamp - b.unix_timestamp);
  
    const embed = new EmbedBuilder().setTitle('Valorant Matches on the Day');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    for (const match of matches) {
      // The payload is 4 hours ahead
      // Convert the UTC timestamp to AST by subtracting 4 hours (UTC-4)
      const matchTimeUTC = new Date(match.unix_timestamp);
      const matchTimeAST = new Date(matchTimeUTC.getTime() - (4 * 60 * 60 * 1000));
  
      // Check if the match time is within today's date range
      if (matchTimeAST.getTime() >= today.getTime() && matchTimeAST.getTime() < tomorrow.getTime()) {
        embed.addFields({ 
          name: `:${match.flag1}: ${match.team1} vs ${match.team2} :${match.flag2}:`, 
          value: matchTimeAST.toLocaleString('en-US', { timeZone: 'AST', hour12: true, hour: 'numeric', minute: '2-digit' }) 
        });
      }
    }
  
    // sendMessageToTest(bot, { embeds: [embed] });
    sendMessageToEsports(bot, { embeds: [embed] });
  } catch (error) {
    console.log('something went wrong with the valorant matches automation', error);
  }
}