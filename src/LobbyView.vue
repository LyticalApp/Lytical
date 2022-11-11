<template>
  <div class="wrapper">
    <LCUErrorMessage v-if="showError" />
    <div v-if="showTimeout">
      <h1>Unable to connect to lobby</h1>
    </div>
    <LoadingDots v-if="loading && !showTimeout" />
    <div v-if="!loading">
      <div class="team">
        <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
          <LobbyPlayerItem v-if="teammate.teamId == 1" :teammate=teammate />
        </div>
      </div>
      <div class="team">
        <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
          <LobbyPlayerItem v-if="teammate.teamId == 2" :teammate=teammate />
        </div>
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
import LoadingDots from './components/LoadingDots.vue';

const { ipcRenderer } = require('electron');

export default {
  name: 'LobbyView',
  components: {
    LCUErrorMessage,
    LobbyPlayerItem,
    LoadingDots,
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
    sortTeamsByRole() {
      const order = [
        'TOP',
        'JUNGLE',
        'MIDDLE',
        'BOTTOM',
        'UTILITY',
      ];
      this.lobbyPlayers.sort((a, b) => {
        console.log('comparing', a.position, b.position);
        if (order.indexOf(a.position) < order.indexOf(b.position)) {
          return -1;
        }
        return 1;
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
        case 'lol-match-playercard':
        case 'lol-lobby-playercard': {
          this.loading = false;
          const filteredData = data;
          filteredData.matchHistory.games.games = filterGameModes(filteredData.matchHistory.games.games);
          if (this.lobbyPlayers.findIndex((p) => p.username === data.username) === -1) this.lobbyPlayers.push(data);
          if (this.lobbyPlayers.length > 4) { this.sortTeamsByRole(); }
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
</style>
