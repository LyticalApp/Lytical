var request = require('request');

let champions = "http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion.json"
let runes = "https://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/runesReforged.json"

function getChampName() {
  request(runes, function (error, response, body) {


    /** 
      let list = JSON.parse(body);
      let championList = list.data;

      for (var i in championList) {
      console.log(championList[i].key + ' : "'+championList[i].id + '",');
      }
    */

      let runes = JSON.parse(body)
      for (rune of runes){
        // Main section
        console.log(rune.id+" : '"+rune.icon+"'")

        for (subrune of rune.slots){
          for(subsub of subrune.runes)
            console.log((subsub.id+" : '"+subsub.icon+"',").toLocaleLowerCase())
        }

        /** 
          for(slot in rune.slots){
            for (sub of runes[slot]){
              console.log(sub)
            }
          }
          */
      } 

  });
}

getChampName()