const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordName: String,
  discordServers: [],
  roles: {
    type: [String],
    enum: ['DM', 'Player', 'Member', 'Admin']
  }
});

module.exports = userSchema;