'use strict';

const parser = require('node-html-parser');
const axios = require('axios');

module.exports = async function parseHtmlPage(sheet) {
  const res = await axios.get(sheet.url).then(res => res.data);
  const root = parser.parse(res);
  const inputs = root.querySelectorAll('input');
  const textarea = root.querySelectorAll('textarea');
  let multiclass = false;
  // change all the ids to match the db property names for easier parsing
  const obj = {};
  inputs.forEach(input => {

  });
  textarea.forEach(input => {

  });
  console.log('parsed obj', obj);
  return obj;
}