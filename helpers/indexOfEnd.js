'use strict';

module.exports = function indexOfEnd(text, str) {
  const io = text.indexOf(str);
  return io == -1 ? -1 : io + str.length;
}