var request = require('request');

let champions = "http://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/champion.json"

function getChampName() {
  request(champions, function (error, response, body) { 
      let list = JSON.parse(body);
      let championList = list.data;
      for (var i in championList) {
      console.log(championList[i].key + ' : "'+championList[i].id + '",');
      }
  });
}

getChampName()