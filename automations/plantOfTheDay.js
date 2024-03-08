
const puppeteer = require('puppeteer');

module.exports = async function plantOfTheDay() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const index = Math.floor(Math.random() * alphabet.length);
  console.log('what is index', index);
  const letter = alphabet[index];
  console.log('what is letter', letter);
  await page.goto(`https://www.treesandshrubsonline.org/articles/${letter.toLowerCase()}`);
  const header = await page.$x("//h2[contains(text(), 'Plant Index')]");
  if (header > 0) {
    // Get the sibling list
    const siblingList = await header[0].$eval('following-sibling::ul', ul => {
        const items = [];
        ul.querySelectorAll('li').forEach(li => {
            items.push(li.textContent.trim());
        });
        return items;
    });

    console.log("Siblings:", siblingList);
  } else {
      console.log("Header containing 'Plant Index' not found");
  }
  await browser.close();
  
};