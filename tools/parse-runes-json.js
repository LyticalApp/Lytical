var request = require('request');

let runes = "https://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/runesReforged.json"

function getChampName() {
  request(runes, function (error, response, body) {
      let runes = JSON.parse(body)
      for (rune of runes){
        console.log((rune.id+" : '"+rune.icon+"',").toLocaleLowerCase())
        for (subrune of rune.slots){
          for(subsub of subrune.runes)
            console.log((subsub.id+" : '"+subsub.icon+"',").toLocaleLowerCase())
        }
      } 
  });
}

getChampName()