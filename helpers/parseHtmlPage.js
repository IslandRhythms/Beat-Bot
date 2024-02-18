'use strict';

const parser = require('node-html-parser');
const axios = require('axios');
const indexOfEnd = require('./indexOfEnd');

module.exports = async function parseHtmlPage(sheet) {
  const res = await axios.get(sheet.url).then(res => res.data);
  const root = parser.parse(res);
  const inputs = root.querySelectorAll('input');
  const textarea = root.querySelectorAll('textarea');
  // change all the names to match the db property names for easier parsing
  const obj = { isMulticlass: false, classes: [], feats: [], equipment: [], stats: { strength: {}, dexterity: {}, constitution: {}, intelligence: {}, wisdom: {}, charisma: {} }};
  inputs.forEach(input => {
    // property
    const name = input.getAttribute('name');
    const stats = name.split(/(?=[A-Z])/);
    // value
    const value = input.getAttribute('value')
    if (stats.length && obj.stats.hasOwnProperty(stats[0])) {
      obj.stats[stats[0]][stats[1].toLowerCase()] = value;
    } else {
      obj[name] = value;
    }

  });
  textarea.forEach(input => {
    // property
    const name = input.getAttribute('name');
    // value
    const value = input.innerText
    const values = input.innerText.split(',');
    if (values.length > 1) {
      for (let i = 0; i < values.length; i++) {
        const props = {};
        if (name == 'classLevels') {
          props.level = values[i][values[i].length - 1];
          props.name = values[i].substring(0, values[i].length - 1).trim();
          obj.classes.push(props);
        } else if (name == 'feats') {
          if (values[i].includes('(')) {
            // need a grep statment for the parenthesis
            const match = values[i].match(/\((.*?)\)/g); // returns an array
            const parenthesisIndex = values[i].indexOf('(');
            props.name = values[i].substring(0, parenthesisIndex).trim();

            props.ASI.amount = parseInt(match[0].match(/\d/g)[0]);
            const endIndex = match[0].search(/\d/);
            props.ASI.stat = match[0].substring(1, endIndex - 1).trim();
            obj.feats.push(props);
          } else {
            props.name = values[i];
            obj.feats.push(props);
          }
        } else if (name == 'equipment') {
          const number = parseInt(values[i].match(/\d+/)[0]);
          const startIndex = indexOfEnd(values[i], values[i].match(/\d+/)[0]);
          props.name = values[i].substring(startIndex, values[i].length).trim();
          props.amount = number;
          obj.equipment.push(props);
        } else {
          obj[name].push(values[i]);
        }
      }
    } else {
      if (name == 'classLevels') {
        obj.classes.push({ name: value.substring(0, value.length - 1).trim(), level: value[value.length - 1] })
      } else if (name == 'feats') {
        if (value.includes('(')) {
          // need a grep statment for the parenthesis
          const match = value.match(/\((.*?)\)/g); // returns an array
          const parenthesisIndex = value.indexOf('(');
          props.name = value.substring(0, parenthesisIndex).trim();

          props.ASI.amount = parseInt(match[0].match(/\d/g)[0]);
          const endIndex = match[0].search(/\d/);
          props.ASI.stat = match[0].substring(1, endIndex - 1).trim();
          obj.feats.push(props);
        } else {
          props.name = value;
          obj.feats.push(props);
        }
      } else if (name == 'equipment') {
          const number = parseInt(value.match(/\d+/)[0]);
          const startIndex = indexOfEnd(value, value.match(/\d+/)[0]);
          props.name = value.substring(startIndex, value.length).trim();
          props.amount = number;
          obj.equipment.push(props);
      } else {
        obj[name] = value;
      }
    }
  });
  if (obj.classes.length > 1) {
    obj.isMulticlass = true;
  }
  console.log('parsed obj', obj);
  return obj;
}