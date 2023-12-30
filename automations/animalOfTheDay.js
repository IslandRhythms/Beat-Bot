
const puppeteer = require('puppeteer');

module.exports = async function animalOfTheDay() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const index = Math.floor(Math.random() * alphabet.length);
  const letter = alphabet[index];
  await page.goto('https://a-z-animals.com/animals/');
  let listItems = null;
  const data = await page.evaluate(() => {
    const header = document.querySelector(`#h-animals-that-start-with-${letter.toLowerCase()}`);
    const container = header.nextElementSibling;
    const ul = container.querySelector('ul');
    listItems = Array.from(ul.querySelectorAll('li')).map(li => {
        const link = li.querySelector('a');
        return {
            text: li.innerText,
            link: link.href
        }
    });
  });
  const animalIndex = Math.floor(Math.random() * listItems.length);
  const AOTD = listItems[animalIndex];
  // await page.goto(listItems[animalIndex].link);
  // animal image contained in the meta tag with property="og:image"
  // animal image for an aardvark for example https://a-z-animals.com/media/animals/images/original/aardvark.jpg
  await browser.close();
  
};