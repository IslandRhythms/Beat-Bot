const mongoose = require('mongoose');
const zodiac = require('../resources/zodiac.json');
const userSchema = new mongoose.Schema({
  discordName: String, // username
  discordId: { // id
    type: String,
    required: true
  },
  discordPic: {
    type: String,
    required: true
  },
  discordServers: [],
  birthday: Date,
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'GameProfile' },
  subscribers: { // always increment by 1
    type: Number,
    default: 0
  },
  bits: { // always increment by 1000
    type: Number,
    default: 0
  },
  roles: {
    type: [String],
    enum: ['DM', 'Player', 'Member', 'Admin']
  },
  availability: {
    type: [String], 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  favorites: {
    games: [{ name: String, url: String }],
    music: [{ name: String, url: String }],
    movies: [{ name: String, url: String }],
    shows: [{ name: String, url: String }],
    foods: [{ name: String, url: String }],
    books: [{ name: String, url: String }]
  },
  accounts: [{
    game: String,
    accountName: String,
    accountPassword: String,
    rank: String,
    usersHaveAccess: [String],
    discordAccountId: String,
    viewedBy: [{ // helpful to track down bad actors
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }]
});


userSchema.virtual('zodiac').get(function() {
  // should never pop up but just in case.
  if(!this.birthday) {
    return `You have not set your birthday. Please use \\setbirthday to set your birthday and receive information about your zodiac sign when its your birthday`
  }
  const maxYear = zodiac[zodiac.length - 1];
  const birthYear = this.birthday.getUTCFullYear();
  if (birthYear <= maxYear) {
    const sign = zodiac.filter(sign => {
      sign.years.some(year => year == birthYear)
    })[0];
    return sign;
  } else { // do math to figure out what year they belong to.
    const startYear = zodiac[0].years[0];
    const index = (birthYear - startYear) % zodiac.length;
  
    // Adjust negative remainders to positive
    const adjustedIndex = index >= 0 ? index : index + zodiac.length;
  
    return zodiac[adjustedIndex];
  }
});

module.exports = userSchema;