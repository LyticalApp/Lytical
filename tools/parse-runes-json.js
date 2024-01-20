/* eslint-disable import/no-extraneous-dependencies */
const request = require('request');

const runesURL = 'https://ddragon.leagueoflegends.com/cdn/13.21.1/data/en_US/runesReforged.json';

const j = {};

function getRuneIcons() {
  request(runesURL, (error, response, body) => {
    const runes = JSON.parse(body);
    for (const rune of runes) {
      j[String(rune.id).toLowerCase()] = rune.icon.toLowerCase();
      for (const subrune of rune.slots) {
        for (const subsub of subrune.runes) { j[String(subsub.id).toLowerCase()] = subsub.icon.toLowerCase(); }
      }
    }
    console.log(j);
  });
}
getRuneIcons();
