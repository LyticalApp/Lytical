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
              <MostPlayedChampions v-if="rankedOverviewData != null" :data=rankedOverviewData />
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
import MostPlayedChampions from './components/MostPlayedChampions.vue';
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
    MostPlayedChampions,
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
      rankedOverviewData: [],
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
    playerCardInfo() {
      if (this.playerCardInfo.username) {
        document.title = `Lytical - ${this.playerCardInfo.username}`;
      }
    },
  },
  methods: {
    filterGameModes,
    searchSummoner(summonerName) {
      if (summonerName !== undefined && summonerName.trim() !== '') {
        // Searchbar name
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-ranked-stats',
          user: summonerName,
        });
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-match-history',
          user: summonerName,
          begIndex: 0,
          endIndex: this.matchHistoryMax,
        });
        // Hack
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-full-ranked-history', user: summonerName,
        });
      } else {
        // Current summoner from LCU
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-ranked-stats-current',
        });
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-match-history-current',
          begIndex: 0,
          endIndex: this.matchHistoryMax,
        });
        ipcRenderer.send('asynchronous-message', {
          id: 'lol-full-ranked-history-current',
        });
      }
    },
  },
  mounted() {
    document.getElementsByClassName('wrapper')[0].addEventListener('scroll', (e) => {
      const d = new Date();
      const currentTime = d.getTime();
      // eslint-disable-next-line max-len
      const isScrolledToBottom = (e.target.scrollHeight - e.target.clientHeight) === parseInt(e.target.scrollTop + 1, 10);
      if (isScrolledToBottom && this.lockout < currentTime) {
        // Request 20 more games.
        this.lockout = currentTime + 1000;
        if (this.$route.params.summonerSearch !== undefined
        && this.$route.params.summonerSearch.trim() !== '') {
          ipcRenderer.send('asynchronous-message', {
            id: 'lol-match-history',
            user: this.$route.params.summonerSearch,
            begIndex: this.matchHistoryMax - 1,
            endIndex: this.matchHistoryMax += 20,
          });
        } else {
          ipcRenderer.send('asynchronous-message', {
            id: 'lol-match-history-current',
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

      // Valid reply handlers
      switch (data.reply_type) {
        case 'lcu-disonnceted': {
          document.title = 'Lytical - Disconnected';
          this.showLoading = false;
          this.showError = true;
          break;
        }
        case 'lcu-reconnected': {
          if (this.showError) window.location.reload();
          break;
        }
        case 'lol-match-history-current':
        case 'lol-match-history': {
          this.matches = this.matches.concat(this.filterGameModes(data.games.games));
          this.showLoading = false;
          break;
        }
        case 'lol-full-ranked-history-current':
        case 'lol-full-ranked-history': {
          if (data.games === undefined) return;
          const gamesOnChampions = {};
          const { games } = data.games;
          // substring 12 meaning patch beginning with a 12..
          // there is no official "current season"
          const season = '12';
          const thisSeason = (games)
            .filter((game) => game.queueId === 420 && game.gameVersion.substring(0, 2) === season);

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
          this.matchHistoryMax = 19;
          break;
        }
        case 'lol-ranked-stats-current':
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
            this.$router.push({
              name: 'Lobby',
            });
          }
          break;
        }
        // Cases to Ignore
        case 'appVersion':
        case 'lol-match-details':
        case 'lol-ranked-stats-match-details': {
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
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
