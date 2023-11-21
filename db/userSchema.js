const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordName: String,
  discordId: String,
  discordServers: [],
  roles: {
    type: [String],
    enum: ['DM', 'Player', 'Member', 'Admin']
  }
});

module.exports = userSchema;