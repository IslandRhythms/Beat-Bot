const config = require('./config.json');
const fetch = require('node-fetch');

const { Timer } = require('timer-node');

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
/*
async function getNews() {
  const res = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?key=${config.steamAPIKEY}&appid=268500`).then(res => res.json());
  console.log('what is res', res);
  console.log('what is news', res.appnews.newsitems[0])
}

getNews();
*/

// Is this readable in memory? I guess it is. Use for discount command.
// multiple results? Have user pick somehow.
// Runtime on the PC is 6 ms. It might run slower on the pi.
async function getGames() {
  const res = await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${config.steamAPIKEY}`).then(res => res.json());
  console.log('what is res', res.applist.apps);
  console.log('starting timer...')
  const timer = new Timer({ label: 'runtime calculation'});
  timer.start();
  console.log(timer.isRunning());
  let j = 0;
  for (let i = 0; i < res.applist.apps.length; i++) {
    const item = res.applist.apps[i];
    if (item.name == 'XCOM 2') {
      console.log('found the game!', item);
      break;
    }
    j++;
  }
  console.log('what is j', j);
  console.log(timer.time());
  timer.stop();
  console.log('done');
}

getGames();