/* eslint-disable import/no-extraneous-dependencies */
const request = require('request');

const champions = 'http://ddragon.leagueoflegends.com/cdn/14.1.1/data/en_US/champion.json';

const j = {};

function getChampName() {
  request(champions, (error, response, body) => {
    const list = JSON.parse(body);
    const championList = list.data;
    for (const i in championList) {
      j[championList[i].key] = championList[i].id;
    }
    console.log(stringifyObject(j));
  });
}


function stringifyObject(obj) {
  const keyValuePairs = Object.entries(obj).map(([key, value]) => `${key}: '${value}'`);
  return `{ ${keyValuePairs.join(', ')} }`;
}



getChampName();
