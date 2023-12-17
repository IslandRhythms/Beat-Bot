

module.exports = async function logPolls(db) {
  const { Poll } = db.models;
  const polls = await Poll.find({ isRecorded: false });
  if (!polls.length) {
    return;
  }
  // make sure that a voter is allowed to vote on the issue at hand
  // also check if there are any entries in the eligibleVoters array
}