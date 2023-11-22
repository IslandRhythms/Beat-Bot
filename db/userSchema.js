const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordName: String,
  discordId: String,
  discordServers: [],
  subscribers: Number,
  bits: Number,
  roles: {
    type: [String],
    enum: ['DM', 'Player', 'Member', 'Admin']
  }
});

module.exports = userSchema;