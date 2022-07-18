<template>
  <div class="wrapper">
    <LCUErrorMessage v-if="showError" />
    <table class="container" style="vertical-align: top;padding: 10px;">
        <td>
          <div id="leftSideBar">
            <Transition>
              <PlayerCard v-if="playerCardInfo != null" :data=playerCardInfo />
            </Transition>
            <Transition>
              <PlayerRank v-if="playerCardInfo != null" :data=playerCardInfo />
            </Transition>
            <Transition>
              <RankedChampionOverview v-if="rankedOverviewData != null" :data=rankedOverviewData />
            </Transition>
          </div>
        </td>
        <td>
          <div v-if="showLoading" class="loadingFrame">
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
import LCUErrorMessage from './components/LCUErrorMessage.vue';
import RankedChampionOverview from './components/RankedChampionOverview.vue';
import {
  filterGameModes,
} from './res/common';

const { ipcRenderer } = require('electron');

export default {
  name: 'HomeView',
  components: {
    MatchHistoryItem,
    PlayerCard,
    PlayerRank,
    LCUErrorMessage,
    RankedChampionOverview,
  },
  data() {
    return {
      polling: null,
      showLoading: true,
      ondata: null,
      showError: false,
      playerCardInfo: {},
      lockout: 0,
      matchHistoryMax: 19,
      rankedOverviewData: null,
      matches: [],
    };
  },
  watch: {
    $route(to, from) {
      // Unregister the listener..
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
    filterGameModes,
    searchSummoner(summonerName) {
      if (summonerName !== undefined && summonerName !== '') {
        // Searchbar name
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-ranked-stats',
          user: summonerName,
        });
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-match-history', user: summonerName, begIndex: 0, endIndex: 19,
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
  mounted() {
    document.getElementsByClassName('wrapper')[0].addEventListener('scroll', (e) => {
      const d = new Date();
      const currentTime = d.getTime();
      const isScrolledToBottom = (e.target.scrollHeight - e.target.clientHeight) === e.target.scrollTop;
      if (isScrolledToBottom && this.lockout < currentTime) {
        // Request 20 more games.
        this.lockout = currentTime + 1000;
        if (this.$route.params.summonerSearch !== undefined && this.$route.params.summonerSearch !== '') {
          ipcRenderer.send('asynchronous-message', {
            id: 'lol-match-history',
            user: this.$route.params.summonerSearch,
            begIndex: this.matchHistoryMax - 1,
            endIndex: this.matchHistoryMax += 20,
          });
        } else {
          ipcRenderer.send('asynchronous-message', {
            id: 'current-summoner',
            begIndex: this.matchHistoryMax - 1,
            endIndex: this.matchHistoryMax += 20,
          });
        }
      }
    });
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
        document.title = 'Lytical - Disconnected';
        this.showError = true;
        this.showLoading = false;
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
          this.matches = this.matches.concat(this.filterGameModes(data.games.games));
          this.showLoading = false;
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

          // Used to Update PlayerRankedCard
          let totalWins = 0;
          let totalLosses = 0;

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
              totalWins += 1;
            } else {
              gamesOnChampions[player.championId].losses += 1;
              totalLosses += 1;
            }
            gamesOnChampions[player.championId].total += 1;
          }

          // Get most played
          const mostPlayedKeyValues = [];
          for (const key in gamesOnChampions) {
            mostPlayedKeyValues.push([key, gamesOnChampions[key].total]);
          }
          mostPlayedKeyValues.sort((kv1, kv2) => kv2[1] - kv1[1]);

          // Create a new Object of only the top 10 most played
          const sorted = [];
          for (const key of mostPlayedKeyValues.slice(0, 7)) {
            sorted.push(gamesOnChampions[key[0]]);
          }

          // Update missing data with new info for playerCardInfo (LCU doesn't show losses in lookup)
          if (this.playerCardInfo.queueMap.RANKED_SOLO_5x5.losses < totalLosses) {
            this.playerCardInfo.queueMap.RANKED_SOLO_5x5.wins = totalWins;
            this.playerCardInfo.queueMap.RANKED_SOLO_5x5.losses = totalLosses;
            this.playerCardInfo.flag = true;
          }
          this.rankedOverviewData = sorted;
          break;
        }
        case 'clear-profile': {
          this.showLoading = true;
          this.matches = [];
          this.playerCardInfo = {};
          this.rankedOverviewData = [];
          this.matchHistoryMax = 9;
          break;
        }
        case 'current-ranked-stats':
        case 'lol-ranked-stats': {
          this.playerCardInfo = data;
          break;
        }
        case 'lol-champ-select': {
          // We switch to the other view for
          // Lobby view
          // display player cards for each player
          console.log('DEBUG autoSwitchLobby:', localStorage.autoSwitchLobby);
          if (localStorage.autoSwitchLobby !== 'false') {
            this.$router.push('lobby');
          }
          break;
        }
        default: {
          console.warn('Handling for', data.reply_type, 'is not implemented in ', this.$route.name);
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
    overflow-y:scroll;
    height:calc(100vh - 42px);
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.errorDiv {
  background-color:#e84057;
  width:100%;
  position:fixed;
  z-index: 999;
}

#leftSideBar {
  padding:10px;
  width: 300px;
}
.loadingFrame{
  margin:auto;
  width:576px;
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
