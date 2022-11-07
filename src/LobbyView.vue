<template>
  <div class="wrapper">
    <LCUErrorMessage v-if="showError" />
    <div v-if="showTimeout">
      <h1>Unable to connect to lobby</h1>
    </div>
    <div v-if="loading && !showTimeout" class="loadingFrame">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="team" v-if="!loading">
      <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
        <LobbyPlayerItem v-if="teammate.teamId == 1" :teammate=teammate></LobbyPlayerItem>
      </div>
    </div>
    <div class="team" v-if="!loading">
      <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
        <LobbyPlayerItem v-if="teammate.teamId == 2" :teammate=teammate></LobbyPlayerItem>
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
      loading: true,
      showTimeout: false,
      ondata: null,
      lobbyPlayers: [],
      selectGameId: 0,
      progressGameId: 0,
      championIds,
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
            this.getSummonerById(player.summonerId, 1, player.assignedPosition);
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
              teamId: (player.team === 'ORDER') ? 1 : 2, // ORDER and CHAOS are the internal names.
            });
          }
          this.lobbyPlayers = [];
          break;
        }
        case 'lol-match-playercard': {
          const filteredData = data;
          filteredData.matchHistory.games.games = filterGameModes(filteredData.matchHistory.games.games);
          if (this.lobbyPlayers.findIndex((p) => p.username === data.username) === -1) this.lobbyPlayers.push(data);
          if (this.lobbyPlayers.length === 10) this.loading = false;
          break;
        }
        case 'lol-lobby-playercard': {
          const filteredData = data;
          filteredData.matchHistory.games.games = filterGameModes(filteredData.matchHistory.games.games);
          if (this.lobbyPlayers.findIndex((p) => p.username === data.username) === -1) this.lobbyPlayers.push(data);
          console.log(this.lobbyPlayers.length);
          if (this.lobbyPlayers.length === 5) this.loading = false;
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
.team {
  display: flex;
  max-width: 1130px;
}

.wrapper {
  margin: auto;
  display: grid;
  align-items: center;
  overflow-y: scroll;
  height: calc(100vh - 42px);
  justify-content: center;
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
