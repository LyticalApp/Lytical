var request = require('request');

function getChampName() {
  request('http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion.json', function (error, response, body) {

    let list = JSON.parse(body);
    let championList = list.data;

    for (var i in championList) {
    console.log(championList[i].key + ' : "'+championList[i].id + '",');
    }

  });
}

getChampName()