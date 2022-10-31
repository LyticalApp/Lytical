<template>
  <div class="wrapper">
    <LCUErrorMessage v-if="showError" />
    <div v-if="showTimeout">
      <h1>Unable to connect to lobby</h1>
    </div>
    <div class="team">
      <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
          <LobbyPlayerItem
            v-if="teammate.teamId == undefined || teammate.teamId == 1"
            :player=teammate>
          </LobbyPlayerItem>
      </div>
    </div>
    <div class="team">
      <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
        <LobbyPlayerItem v-if="teammate.teamId == 2" :player=teammate></LobbyPlayerItem>
      </div>
    </div>
  </div>
</template>

<script>
import {
  filterGameModes,
  championIds,
} from './res/common';
import LCUErrorMessage from './components/LCUErrorMessage.vue';
import LobbyPlayerItem from './components/LobbyPlayerItem.vue';

const { ipcRenderer } = require('electron');

export default {
  name: 'LobbyView',
  components: {
    LCUErrorMessage,
    LobbyPlayerItem,
  },
  data() {
    return {
      showError: false,
      polling: null,
      timeout: null,
      showTimeout: false,
      ondata: null,
      lobbyPlayers: [],
      selectGameId: 0,
      progressGameId: 0,
      championIds,
    };
  },
  watch: {
    lobbyPlayers() {
      console.log(this.lobbyPlayers);
    },
    $route() {
      // Unregister the listener..
      console.log('Unregistering Listeners on Lobby');
      ipcRenderer.removeListener('asynchronous-reply', this.ondata);
      clearInterval(this.polling);
    },
  },
  methods: {
    filterGameModes,
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
              championId: namesToId[player.rawChampionName.replace('game_character_displayname_', '')],
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
  border-radius: 10px;
  width: 20px;
  height: 20px;
}

.kda {
  margin-left: 10px;
  padding: 0 10px 0px 10px;
  font-size: 15px;
  color: var(--dark-grey);
  text-align: center !important;
  display: inline-block;
  width: 55px;
  border-radius: 4px;
  font-weight: 400;
}

.emblem {
  height: 70px;
}

.selectedChampion {
  border-radius: 50%;
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
  font-size: 15px;
  margin-left: 4px;
  width: 28px;
  display: inline-block;
  background-color: var(--minicard-since-background);
  border-radius: 4px;
  padding-left: 4px;
  padding-right: 4px;
  text-align: center;
}

.matchItem {
  margin: auto;
  width: 150px;
  text-align: left;
}

.team {
  display: flex;
  max-width: 1130px;
}

.miniCard {
  min-height: 232px;
  margin: 10px;
  padding: 10px;
  color: var(--minicard-text);
  border-radius: 5px;
  background-color: var(--minicard-background);
  filter: drop-shadow(0 0 0.1rem #5cd7e4);
}

.wrapper {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  height: calc(100vh - 42px);
  flex-wrap: wrap;
  justify-content: center;
}
</style>
