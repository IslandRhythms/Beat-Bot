'use strict';

const parser = require('node-html-parser');
const axios = require('axios');

module.exports = async function parseHtmlPage(sheet) {
  const res = await axios.get(sheet.url).then(res => res.data);
  const root = parser.parse(res);
}