const fs = require('fs');

const gamesOnChampions = {};

try {
  const data = fs.readFileSync('./games.json', 'utf8');
  const rankedGames = JSON.parse(data).filter((game) => game.queueId === 420);
  const thisSeason = rankedGames.filter((game) => game.gameVersion.substring(0, 2) === '12');
  for (const game of thisSeason) {
    const player = game.participants[0];
    const tempObj = {
      kills: 0,
      deaths: 0,
      assists: 0,
      wins: 0,
      losses: 0,
    };
    if (gamesOnChampions[player.championId] === undefined) {
      gamesOnChampions[player.championId] = tempObj;
    }
    gamesOnChampions[player.championId].kills += player.stats.kills;
    gamesOnChampions[player.championId].deaths += player.stats.deaths;
    gamesOnChampions[player.championId].assists += player.stats.assists;
    if (player.stats.win) {
      gamesOnChampions[player.championId].wins += 1;
    } else {
      gamesOnChampions[player.championId].losses += 1;
    }
  }
  console.log(gamesOnChampions);
} catch (err) {
  console.error(err);
}
