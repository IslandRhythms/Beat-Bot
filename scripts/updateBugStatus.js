'use strict';

const db = require('../db');

async function updateBugStatus() {
  const conn = await db();

  const { BugReport } = conn.models;

  const bugId = process.argv[2];
  const status = process.argv[3];

  const report = await BugReport.findOne({ $or: [{ _id: bugId }, { bugId }] });
  report.status = status;
  await report.save();
  console.log('Report updated successfully!', report);
  process.exit(0);
}

updateBugStatus().catch(err => {
  console.log(err);
  process.exit(-1);
});