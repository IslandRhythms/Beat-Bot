'use strict';
const puppeteer = require('puppeteer');

module.exports = async function animalOfTheDay() {
  const browser = await puppeteer.launch({
    headless: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });
  const page = await browser.newPage();
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const index = Math.floor(Math.random() * alphabet.length);
  console.log('what is index', index);
  const letter = alphabet[index];
  console.log('what is letter', letter);
  await page.goto(`https://a-z-animals.com/animals/animals-that-start-with-${letter.toLowerCase()}`);
  const animalChoices = await page.evaluate((letter) => {
    console.log('letter inside evaluate', letter)
    const header = document.querySelector(`#h-alphabetical-list-of-animals-that-start-with-${letter.toLowerCase()}`);
    console.log('what is header', header)
    const container = header.nextElementSibling;
    console.log('what is container', container);
    const ul = container.querySelector('ul');
    let listItems = Array.from(ul.querySelectorAll('li')).map(li => {
        const link = li.querySelector('a');
        return {
            animalName: li.innerText,
            link: link.href
        }
    });
    return listItems;
  }, letter);
  
  const animalIndex = Math.floor(Math.random() * animalChoices.length);
  const AOTD = animalChoices[animalIndex];
  console.log('what is AOTD', AOTD)
  const data = await page.evaluate((animalObj) => {
    const header = document.querySelector(`#h-animals-that-start-with-${animalObj.letter.toLowerCase()}`);
    const container = header.nextElementSibling;
    const animals = Array.from(container.querySelectorAll('h3 a'));
    let info = {};
    animals.forEach((a) => {
      if (a.textContent.trim() == animalObj.animal) {
        const div = a.parentNode.nextSibling;
        const imgDiv = div.querySelector('div:nth-child(1)');
        const imgAnchor = imgDiv.querySelector('a');
        const img = imgAnchor.querySelector('img');
        info.image = img ? img.src : '';
        
        // There's other stuff that I ignored because I didn't feel like it added anything.
        const scientificDiv = div.querySelector('div:nth-child(2)');
        const funFactTag = scientificDiv.querySelector('p');
        info.funFact = funFactTag ? funFactTag.textContent.trim() : '';

        const dlElement = scientificDiv.querySelector('dl');
        const tableData = dlElement.querySelectorAll('dd');
        const lastEntry = tableData[tableData.length - 1].textContent.trim();
        info.scientificName = lastEntry;


        const briefSummaryDiv = div.querySelector('div:nth-child(3)');
        const briefSummaryTag = briefSummaryDiv.querySelector('p');
        info.briefSummary = briefSummaryTag ? briefSummaryTag.textContent.trim() : '';
        const cutOff = info.briefSummary.indexOf('['); // info.briefSummary.indexOf('Read');
        info.briefSummary = info.briefSummary.substring(0, cutOff).trim();
      }
    })
    return info;
  }, { animal: AOTD.animalName, letter });
  await page.close();
  await browser.close();
  Object.assign(AOTD, data);
  return AOTD;
};