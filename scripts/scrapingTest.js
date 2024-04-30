const puppeteer = require('puppeteer')

run().catch(e => {
  console.log(e);
  process.exit(-1);
})

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const index = Math.floor(Math.random() * alphabet.length);
  console.log('what is index', index);
  const letter = alphabet[index];
  console.log('what is letter', letter);
  await page.goto(`https://www.treesandshrubsonline.org/articles/${letter.toLowerCase()}`);


  await page.waitForSelector('h2', { timeout: 10000 });
  const data = await page.evaluate(() => {
      const headers = document.querySelectorAll('h2'); // Adjust the selector as needed
      for (const header of headers) {
          if (header.textContent.trim() === 'Plant Index') {
            
            if(header.nextElementSibling) {
              const listElements = header.nextElementSibling.querySelectorAll('li');
              const results = [];
              listElements.forEach(li => {
                const anchor = li.querySelector('a.ids-browse-link');
                if (anchor) {
                  const name = anchor.textContent
                  const link = anchor.getAttribute('href');
                  results.push({ name, link });
                }
              });
              return results;
            }
          
          }
      }
  });
  console.log('what is data', data);
  const selectedPlantIndex = Math.floor(Math.random() * data.length);
  const selectedPlant =  data[selectedPlantIndex];
  console.log('what is selectedPlant.link', selectedPlant.link);
  await page.goto(`https://www.treesandshrubsonline.org${selectedPlant.link}`);
  const imageLink = await page.evaluate(() => {
    const name = document.querySelector('h1');
    console.log('what is name', name.textContent);
    const imageElements = Array.from(document.querySelectorAll('img'));
    const correctElement = imageElements.find(x => x.getAttribute('alt').includes(name.textContent) || name.textContent.includes(x.getAttribute('alt')));
    console.log('what is correct element', correctElement);
    // not all are going to have an image
    if (correctElement) {
      console.log('what is correct element', correctElement, name);
      return correctElement.getAttribute('src');
    }
  });

  console.log('what is imageLink', imageLink)
  if (imageLink == null) {
    const routeParts = selectedPlant.link.split('/');
    console.log('what is routeParts', routeParts);
    await page.goto(`https://www.treesandshrubsonline.org/articles/${routeParts[2]}`);
    const backupImageLink = await page.evaluate(() => {
      const name = document.querySelector('h1');
      console.log('what is name', name.textContent);
      const imageElements = Array.from(document.querySelectorAll('img'));
      const correctElement = imageElements.find(x => x.getAttribute('alt').includes(name.textContent) || name.textContent.includes(x.getAttribute('alt')));
      console.log('what is correct element', correctElement);
      // not all are going to have an image
      if (correctElement) {
        console.log('what is correct element', correctElement, name);
        return correctElement.getAttribute('src');
      }
    });
    console.log('what is backup', backupImageLink)
  }
  
  // await browser.close();
}