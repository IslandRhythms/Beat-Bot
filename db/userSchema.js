const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordName: String,
  discordId: String,
  discordServers: [],
  subscribers: Number, // always increment by 1
  bits: Number, // always increment by 1000
  roles: {
    type: [String],
    enum: ['DM', 'Player', 'Member', 'Admin']
  }
});

module.exports = userSchema;