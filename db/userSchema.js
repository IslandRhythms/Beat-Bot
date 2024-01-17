const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordName: String,
  discordId: String,
  discordServers: [],
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'GameProfile' },
  subscribers: Number, // always increment by 1
  bits: Number, // always increment by 1000
  roles: {
    type: [String],
    enum: ['DM', 'Player', 'Member', 'Admin']
  },
  availability: {
    type: [String], 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }
});

module.exports = userSchema;