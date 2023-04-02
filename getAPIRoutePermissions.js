const config = require('./config.json');
const fetch = require('node-fetch');

async function run() {
  // check what routes this key grants
  const res = await fetch(`http://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v0001/?key=${config.steamAPIKEY}`).then(res => res.json());
  let apis = res.apilist.interfaces;
  console.log('The apis I have permission to are?', apis);
  // get the ones I care about
  const care = [];
  for (let i = 0; i < apis.length; i++) {
    if (apis[i].name.includes('Steam') || apis[i].name.includes('Auth')) {
      care.push(apis[i]);
    }
  }
  console.log('the ones we care about', care);
  // print the methods
  console.log('there name and methods')
  care.forEach( item => {
    console.log('====================================')
    console.log(item.name, item.methods);
    const index = item.methods.find(entry => entry.name == 'GetCollectionDetails')
    console.log('what is index?', index);
    if (index) {
      console.log('what are the params?', index);
    }
  });
}

// run();

//get news for xcom
// possible steam integration
// not very reliable, any mention of xcom and its considered news
async function getNews() {
  const res = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?key=${config.steamAPIKEY}&appid=268500`).then(res => res.json());
  console.log('what is res', res);
  console.log('what is news', res.appnews.newsitems[0])
}

getNews();