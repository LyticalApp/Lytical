<template>
    <div class="wrapper">
        <LCUErrorMessage v-if="showError" />
        <div v-if="showTimeout">
          <h1>Unable to connect to lobby</h1>
        </div>
        <div class="team">
            <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
                <div v-if="teammate.teamId == undefined || teammate.teamId == 1" class="miniCard">
                    <img v-if="teammate.championId"
                    class="selectedChampion emblem" :src="CHAMPIONICONURL+teammate.championId+'.png'">
                    <img class="emblem" :src='`assets/Emblem_${teammate.queueMap.RANKED_SOLO_5x5.tier}.webp`'>
                    <br>
                    <span @click="searchSummoner(teammate.username)">{{teammate.username}}</span>
                    <br>
                    <span style="font-size:12px;">{{capitalize(teammate.queueMap.RANKED_SOLO_5x5.tier)}}
                        {{romanNumbers[teammate.queueMap.RANKED_SOLO_5x5.division]}}
                        ({{teammate.queueMap.RANKED_SOLO_5x5.leaguePoints}}LP)</span>
                    <br>
                    <span style="font-size:12px;">{{capitalize(teammate.position)}}</span>
                    <br>
                    <div v-for="(match,index) in teammate.matchHistory.games.games" :key="match.gameId"
                        class="matchItem">
                        <div v-if="!(teammate.teamId == 1 && index > 4)">
                            <img @click="open(getPreferredSite(match.participants[0].championId))"
                                :src="CHAMPIONICONURL+match.participants[0].championId+'.png'"
                                class="championIcon">
                            <div :class='`kda ${match.participants[0].stats.win ? "Victory" : "Defeat"}`'>
                                <span style="white-space:nowrap">
                                  {{match.participants[0].stats.kills + "/"
                                  + match.participants[0].stats.deaths + "/"
                                  + match.participants[0].stats.assists}}
                                </span>
                            </div>
                            <span class="sinceGame">{{sinceGame(Date.now()-match.gameCreation)}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="team">
            <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
                <div v-if="teammate.teamId == 2" class="miniCard">
                  <img v-if="teammate.championId"
                    class="selectedChampion emblem" :src="CHAMPIONICONURL+teammate.championId+'.png'">
                    <img class="emblem" :src='`assets/Emblem_${teammate.queueMap.RANKED_SOLO_5x5.tier}.webp`'>
                    <br>
                    <span @click="searchSummoner(teammate.username)">{{teammate.username}}</span>
                    <br>
                    <span style="font-size:12px;">{{capitalize(teammate.queueMap.RANKED_SOLO_5x5.tier)}}
                        {{romanNumbers[teammate.queueMap.RANKED_SOLO_5x5.division]}}
                        ({{teammate.queueMap.RANKED_SOLO_5x5.leaguePoints}}LP)</span>
                    <br>
                    <span style="font-size:12px;">{{capitalize(teammate.position)}}</span>
                    <br>
                    <div v-for="(match,index) in teammate.matchHistory.games.games" :key="match.gameId"
                        class="matchItem">
                        <div v-if="index < 5">
                            <img @click="open(getPreferredSite(match.participants[0].championId))"
                                :src="CHAMPIONICONURL+match.participants[0].championId+'.png'"
                                class="championIcon">
                            <div :class='`kda ${match.participants[0].stats.win ? "Victory" : "Defeat"}`'>
                                <span style="white-space:nowrap">
                                  {{match.participants[0].stats.kills + "/"
                                  + match.participants[0].stats.deaths + "/"
                                  + match.participants[0].stats.assists}}
                                </span>
                            </div>
                            <span class="sinceGame">{{sinceGame(Date.now()-match.gameCreation)}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
  championIds, romanNumbers, CHAMPIONICONURL, getPreferredSite, filterGameModes,
} from './res/common';
import LCUErrorMessage from './components/LCUErrorMessage.vue';

const { ipcRenderer } = require('electron');
const open = require('open');

export default {
  name: 'LobbyView',
  components: {
    LCUErrorMessage,
  },
  data() {
    return {
      CHAMPIONICONURL,
      championIds,
      romanNumbers,
      showError: false,
      polling: null,
      timeout: null,
      showTimeout: false,
      ondata: null,
      lobbyPlayers: [],
      selectGameId: 0,
      progressGameId: 0,
    };
  },
  watch: {
    $route() {
      // Unregister the listener..
      console.log('Unregistering Listeners on Lobby');
      ipcRenderer.removeListener('asynchronous-reply', this.ondata);
      clearInterval(this.polling);
    },
  },
  methods: {
    getPreferredSite,
    filterGameModes,
    open,
    getSummonerById(id, teamId, position) {
      ipcRenderer.send('asynchronous-message', {
        id: 'lol-lobby-playercard',
        summonerId: id,
        pos: position,
        teamId,
      });
    },
    clearErrorTimeout() {
      this.showTimeout = false;
      clearTimeout(this.timeout);
    },
    capitalize(s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();
    },
    sinceGame(secondsN) {
      const seconds = Number(secondsN / 1000);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor((seconds % (3600 * 24)) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      if (d > 0) return (`${d}d`);
      if (h > 0) return (`${h}h`);
      return (`${m}m`);
    },
    searchSummoner(summoner) {
      this.$router.push({
        name: 'Home',
        params: {
          summonerSearch: summoner,
        },
      });
    },
    getLobbyStatus() {
      ipcRenderer.send('asynchronous-message', {
        id: 'lol-champ-select',
      });
      ipcRenderer.send('asynchronous-message', {
        id: 'liveclientdata-playerlist',
      });
    },
  },
  created() {
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
          this.showError = true;
          break;
        }
        case 'lcu-reconnected': {
          if (this.showError) window.location.reload();
          break;
        }
        case 'lol-champ-select': {
          this.clearErrorTimeout();
          if (this.selectGameId === data.gameId) return;
          document.title = 'Lytical - Champion Select';
          this.lobbyPlayers = [];
          this.selectGameId = data.gameId;
          for (const player of data.myTeam) {
            this.getSummonerById(player.summonerId, undefined, player.assignedPosition);
          }
          break;
        }
        case 'liveclientdata-playerlist': {
          this.clearErrorTimeout();
          if (this.lobbyPlayers.length > 5) return;
          document.title = 'Lytical - Live Game';
          const flipKeys = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
          const namesToId = flipKeys(this.championIds);

          for (const player of data) {
            ipcRenderer.send('asynchronous-message', {
              id: 'lol-match-playercard',
              position: player.position,
              summonerName: player.summonerName,
              championId: namesToId[player.championName.replace(/\s/g, '')],
              teamId: (player.team === 'ORDER') ? 1 : 2,
            });
          }
          this.lobbyPlayers = [];
          break;
        }
        case 'lol-match-playercard':
        case 'lol-lobby-playercard': {
          const filteredData = data;
          filteredData.matchHistory.games.games = filterGameModes(filteredData.matchHistory.games.games);
          this.lobbyPlayers.push(filteredData);
          break;
        }
        default: {
          console.warn('Handling for', data.reply_type, 'is not implemented in ', this.$route.name);
          break;
        }
      }
    };
    ipcRenderer.on('asynchronous-reply', this.ondata);

    document.title = 'Lytical';
    if (this.timeout == null) {
      this.timeout = setTimeout(() => { this.showTimeout = true; }, 5000);
    }

    this.getLobbyStatus();
    this.polling = setInterval(this.getLobbyStatus, 15000);
  },

};
</script>

<style scoped>
.championIcon {
  border-radius:10px;
  width:20px;
  height:20px;
}
.kda {
    margin-left:10px;
    padding:0 10px 0px 10px;
    font-size:15px;
    color: var(--dark-grey);
    text-align:center !important;
    display:inline-block;
    width:55px;
    border-radius:4px;
    font-weight: 400;
}
.emblem {
  height:70px;
}
.selectedChampion {
  border-radius:50%;
}
.Victory {
    color: var(--lobby-victory-text);
    background-color: var(--lobby-victory-background);
}
.Defeat {
    color: var(--lobby-defeat-text);
    background-color: var(--lobby-defeat-background);
}
.sinceGame {
  font-size:15px;
  margin-left:4px;
  width:28px;
  display:inline-block;
  background-color: var(--minicard-since-background);
  border-radius:4px;
  padding-left:4px;
  padding-right:4px;
  text-align: center;
}
.matchItem {
    margin:auto;
    width:150px;
    text-align:left;
}
.team {
    display: flex;
    max-width: 1130px;
}
.miniCard {
    min-height: 232px;
    margin: 10px;
    padding:10px;
    color: var(--minicard-text);
    border-radius: 5px;
    background-color: var(--minicard-background);
    filter: drop-shadow(0 0 0.1rem #5cd7e4);
}
.wrapper {
    margin:auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y:scroll;
    height:calc(100vh - 42px);
    flex-wrap: wrap;
    justify-content: center;
}
</style>
