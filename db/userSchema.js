const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordName: String,
  discordServers: [],
  roles: {
    type: [],
    enum: ['DM', 'Player', 'Member', 'Admin']
  }
});

module.exports = userSchema;