const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  messageLink: String, // a link to the message. discord.com/channels/guildId/channelId/messageId
  messageId: String, // the discord id of the message
  isRecorded: {
    type: Boolean,
    default: false
  },
  isBinary: {
    type: Boolean
  },
  voters: [{
    voter: {
      discordId: String,
      discordName: String
    },
    choice: String,
  }],
  choices: [String],
  eligibleVoters: [String], // array of strings of discordIds
  target: String, // optional string indicating who the poll was directed toward.
  question: String,
  result: String,
  pollId: String // the total number of poll documents at this documents creation
});

module.exports = pollSchema;