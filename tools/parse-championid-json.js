/* eslint-disable import/no-extraneous-dependencies */
const request = require('request');

const champions = 'http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json';

const j = {};

function getChampName() {
  request(champions, (error, response, body) => {
    const list = JSON.parse(body);
    const championList = list.data;
    for (const i in championList) {
      j[championList[i].key] = championList[i].id;
    }
    console.log(j);
  });
}

getChampName();
