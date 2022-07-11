<template>
  <div class="wrapper">
    <div v-show='showError' class="errorDiv">
      <h1>LCU Disconnected</h1>
    </div>
    <table class="container" style="vertical-align: top;">
        <td>
          <div id="leftSideBar">
              <PlayerCard :data=playerCardInfo />
              <PlayerRank :data=playerCardInfo />
              <RankedChampionOverview :data=rankedOverviewData />
          </div>
        </td>
        <td>
          <div v-if="!matches.length && !showError" class="loadingFrame">
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
          </div>
          <MatchHistoryItem v-for="match in matches"
              :key=match.gameId
              :data=match
              :profileSummoner=playerCardInfo.username
              />
        </td>
    </table>
  </div>
</template>

<script>
import MatchHistoryItem from './components/MatchHistoryItem.vue';
import PlayerCard from './components/PlayerCard.vue';
import PlayerRank from './components/PlayerRank.vue';
import RankedChampionOverview from './components/RankedChampionOverview.vue';

const { ipcRenderer } = require('electron');

export default {
  name: 'HomeView',
  components: {
    MatchHistoryItem,
    PlayerCard,
    PlayerRank,
    RankedChampionOverview,
  },
  data() {
    return {
      polling: null,
      ondata: null,
      showError: false,
      playerCardInfo: {},
      rankedOverviewData: null,
      matches: {},
    };
  },
  watch: {
    $route(to, from) {
      // Unregister the listener..
      console.log(to, from);
      if (to.name !== from.name) {
        console.log('Unregistering Listeners on Home');
        ipcRenderer.removeListener('asynchronous-reply', this.ondata);
        clearInterval(this.polling);
      } else {
        this.searchSummoner(to.params.summonerSearch);
      }
    },
  },
  methods: {
    searchSummoner(summonerName) {
      if (summonerName !== undefined && summonerName !== '') {
        // Searchbar name
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-ranked-stats',
          user: summonerName,
        });
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-match-history', user: summonerName, begIndex: 0, endIndex: 9,
        });
        // Hack
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-full-ranked-history', user: summonerName,
        });
      } else {
        // Current summoner from LCU
        ipcRenderer.send('asynchronous-message', {
          id: 'current-ranked-stats',
        });
        ipcRenderer.send('asynchronous-message', {
          id: 'current-summoner',
          begIndex: 0,
          endIndex: 9,
        });
        ipcRenderer.send('asynchronous-message', { id: 'current-full-ranked-history' });
      }
    },
    getQueueName(queueId) {
      return this.queueIds[queueId] !== '' ? this.queueIds[queueId] : 'Custom';
    },
  },
  created() {
    // First run only
    this.ondata = (event, data) => {
      // Dug
      console.log('DEBUG: Async Reply: ', data);

      // All replies should have a reply_type set.
      if (data.reply_type === undefined) {
        console.log('ERROR UNSET REPLY_TYPE in DATA');
        return;
      }

      // We have diconnected or auth error..
      if (data.reply_type === 'lcu-disonnceted') {
        this.showError = true;
        return;
      }
      if (data.reply_type === 'lcu-disonnceted') this.showError = false;

      // Valid reply handlers
      switch (data.reply_type) {
        case 'lcu-disonnceted': {
          this.showError = true;
          break;
        }
        case 'lcu-reconnected': {
          if (this.showError) window.location.reload();
          break;
        }
        case 'current-summoner':
        case 'lol-match-history': {
          this.matches = data.games.games;
          break;
        }
        case 'current-full-ranked-history':
        case 'lol-full-ranked-history': {
          const gamesOnChampions = {};
          const { games } = data.games;
          // substring 12 meaning patch beginning with a 12..
          // there is no official "current season"
          const thisSeason = (games)
            .filter((game) => game.queueId === 420)
            .filter((game) => game.gameVersion.substring(0, 2) === '12');
          // eslint-disable-next-line guard-for-in
          for (const game of thisSeason) {
            const player = game.participants[0];
            const tempObj = {
              id: 0,
              kills: 0,
              deaths: 0,
              assists: 0,
              wins: 0,
              losses: 0,
              total: 0,
              cs: 0,
              time: 0,
            };
            if (gamesOnChampions[player.championId] === undefined) {
              gamesOnChampions[player.championId] = tempObj;
            }
            gamesOnChampions[player.championId].id = player.championId;
            gamesOnChampions[player.championId].kills += player.stats.kills;
            gamesOnChampions[player.championId].deaths += player.stats.deaths;
            gamesOnChampions[player.championId].assists += player.stats.assists;
            gamesOnChampions[player.championId].time += game.gameDuration;
            gamesOnChampions[player.championId].cs += player.stats.neutralMinionsKilled;
            gamesOnChampions[player.championId].cs += player.stats.totalMinionsKilled;
            if (player.stats.win) {
              gamesOnChampions[player.championId].wins += 1;
            } else {
              gamesOnChampions[player.championId].losses += 1;
            }
            gamesOnChampions[player.championId].total += 1;
          }

          const keyValues = [];

          // Get most played
          // eslint-disable-next-line guard-for-in
          for (const key in gamesOnChampions) {
            keyValues.push([key, gamesOnChampions[key].total]);
          }
          keyValues.sort((kv1, kv2) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            kv2[1] - kv1[1]);

          // Create a new Object of only the top 10 most played
          const sorted = [];

          // eslint-disable-next-line guard-for-in
          for (const key of keyValues.slice(0, 7)) {
            sorted.push(gamesOnChampions[key[0]]);
          }

          this.rankedOverviewData = sorted;
          break;
        }
        case 'clear-profile': {
          this.matches = {};
          this.playerCardInfo = {};
          this.rankedOverviewData = {};
          break;
        }
        case 'current-ranked-stats':
        case 'lol-ranked-stats': {
          this.playerCardInfo = data;
          break;
        }
        case 'lol-champ-select': {
          // We switch to the other view for
          // pregame lobbies which will
          // display player cards for each player
          console.log('DEBUG:', localStorage.autoSwitchLobby);
          if (localStorage.autoSwitchLobby === 'true'
              || localStorage.autoSwitchLobby === undefined) {
            this.$router.push('pregame');
          }
          break;
        }
        default: {
          console.error('Handling for', data.reply_type, 'is not implemented');
          break;
        }
      }
    };
    ipcRenderer.on('asynchronous-reply', this.ondata);
    this.searchSummoner(this.$route.params.summonerSearch);

    // Poll for champion select state
    this.polling = setInterval(() => {
      ipcRenderer.send('asynchronous-message', { id: 'lol-champ-select' });
    }, 15000);
  },
};
</script>

<style scoped>
.wrapper {
    margin:auto;
    display: flex;
    justify-content: center;
    overflow:scroll;
    height:calc(100vh - 55px);
}
.errorDiv {
  background-color:#e84057;
  width:100%;
  position:fixed;
  z-index: 999;
}

#leftSideBar {
  padding-right:10px;
  width: 300px;
}
.loadingFrame{
  margin:auto;
  width:605px;
  position:relative;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #5a4656;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
