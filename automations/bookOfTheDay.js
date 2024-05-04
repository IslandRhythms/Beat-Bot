'use strict';
const axios = require('axios');

module.exports = async function bookOfTheDay() {
  const data = await axios.get(`https://openlibrary.org/random`).then(res => res.data);
  const { oclc_numbers, isbn_10, isbn_13, title, key} = data;
  const obj = {};
  if(oclc_numbers) {
    console.log(oclc_numbers[0])
    obj.OCLC = oclc_numbers[0];
  }
  if (isbn_10) {
    console.log(isbn_10[0])
    obj.ISBNX = isbn_10[0];
  }
  if (isbn_13) {
    console.log(isbn_13[0])
    obj.ISBN13 = isbn_13[0];
  }
  obj.title = title;
  obj.bookRoute = key;

  return { bookOTD: obj }
}