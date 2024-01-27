const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String
});

const accountSchema = new mongoose.Schema({
  name: String
});

const addressSchema = new mongoose.Schema({
  name: String
});

const nestedSchema = new mongoose.Schema({
  name: String
});

const testSchema = new mongoose.Schema({
  name: String,
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  account: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  value: [{ name: String, nested: { type: mongoose.Schema.Types.ObjectId, ref: 'Nested' } }]
});

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);
const Address = mongoose.model('Address', addressSchema);
const Nested = mongoose.model('Nested', nestedSchema);
const Test = mongoose.model('Test', testSchema);

async function run() {
  await mongoose.connect('mongodb://localhost:27017');
  await mongoose.connection.dropDatabase();

  const user = await User.create({ name: 'Test' });
  const account = await Account.create({ name: 'test' });
  const address = await Address.create({ name: 'address' });
  const nested = await Nested.create({ name: 'nested' });

  await Test.create({ name: 'Test Testerson', user: [user._id], account: [account._id], address: [address._id], value: [{ name: 'nested value', nested: nested._id }]});
  const res = await Test.findOne().populate('user').populate('account').populate('address').populate('value.nested');
  console.log('what is res', res, 'nested value', res.value[0].nested);
}

run();

