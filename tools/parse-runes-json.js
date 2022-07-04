var request = require('request');

let runes = "https://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/runesReforged.json"

let j = {}

function getRuneIcons() {
  request(runes, function (error, response, body) {
      let runes = JSON.parse(body)
      for (rune of runes){
        j[String(rune.id).toLowerCase()] = rune.icon.toLowerCase()
        for (subrune of rune.slots){
          for(subsub of subrune.runes)
            j[String(subsub.id).toLowerCase()] = subsub.icon.toLowerCase()
        }
      } 
      console.log(j)
  });
}
getRuneIcons()