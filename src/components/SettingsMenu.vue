<template>
    <div class="myModal">
        <div style="left:50%;margin:auto;align:left;">
            <h1>Settings</h1>
            <table style="left:50%;margin:auto;">
                <tr>
                    <td>Automatically switch to lobby</td>
                    <td>
                    <input v-model="autoSwitchLobby" type="checkbox"
                     :checked="autoSwitchLobby == 'true'">
                    </td>
                    </tr>
                    <tr>
                    <td>Show ranks in match details</td>
                    <td>
                    <input v-model="showRanksInDetails" type="checkbox"
                     :checked="showRanksInDetails == 'true'">
                    </td>
                </tr>
                <tr>
                    <td>Stats/Champion Website</td>
                <td>
                    <select v-model="statsSite" name="stats-website">
                        <option value="opgg">op.gg</option>
                        <option value="ugg">u.gg</option>
                        <option value="blitz">blitz.gg</option>
                        <option value="leagueofgraphs">leagueofgraphs</option>
                        <option value="qq">101.qq</option>
                    </select>
                </td>
                </tr>
                <tr>
                    <td>Filter (checked items displayed)</td>
                    <td>
                    <input v-model="showSoloGames" :checked="showSoloGames == 'true'" type="checkbox"> Solo/Duo
                    <input v-model="showFlexGames" :checked="showFlexGames == 'true'" type="checkbox"> Flex
                    <input v-model="showNormalGames" :checked="showNormalGames == 'true'" type="checkbox"> ARAM/Normal
                    </td>
                </tr>
                <tr>
                    <td>Scale</td>
                    <td>
                      <button @click="scaleUp">+</button>
                      <button @click="scaleDown">-</button>
                    </td>
                </tr>
            </table>
        </div>
        <div>
          <h3>Debug</h3>
          <span>Version: {{version}}</span><br>
          <button @click="openDevTools">Open Dev Tools</button>
          </div>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');

export default {
  name: 'SettingsMenu',
  mounted() {
    // Load settings because localStorage isn't ready until mount
    if (localStorage.autoSwitchLobby) this.autoSwitchLobby = localStorage.getItem('autoSwitchLobby');
    if (localStorage.statsSite) this.statsSite = localStorage.getItem('statsSite');
    if (localStorage.showSoloGames) this.showSoloGames = localStorage.getItem('showSoloGames');
    if (localStorage.showFlexGames) this.showFlexGames = localStorage.getItem('showFlexGames');
    if (localStorage.showNormalGames) this.showNormalGames = localStorage.getItem('showNormalGames');
    if (localStorage.showRanksInDetails) this.showRanksInDetails = localStorage.getItem('showRanksInDetails');
    this.getAppVersion();
  },
  data() {
    return {
      version: '',
      autoSwitchLobby: 'true',
      statsSite: 'opgg',
      showSoloGames: 'true',
      showFlexGames: 'true',
      showNormalGames: 'true',
      showRanksInDetails: 'true',
    };
  },
  methods: {
    openDevTools() {
      ipcRenderer.send('asynchronous-message', {
        id: 'openDevTools',
      });
    },
    getAppVersion() {
      ipcRenderer.on('asynchronous-reply', (event, data) => {
        if (data.reply_type === 'appVersion') {
          this.version = data.version;
        }
      });
      ipcRenderer.send('asynchronous-message', {
        id: 'getVersion',
      });
    },
    scaleUp() {
      ipcRenderer.send('asynchronous-message', {
        id: 'scaleUp',
      });
    },
    scaleDown() {
      ipcRenderer.send('asynchronous-message', {
        id: 'scaleDown',
      });
    },
  },
  watch: {
    autoSwitchLobby(state) {
      localStorage.setItem('autoSwitchLobby', state);
    },
    showSoloGames(state) {
      localStorage.setItem('showSoloGames', state);
    },
    showFlexGames(state) {
      localStorage.setItem('showFlexGames', state);
    },
    showNormalGames(state) {
      localStorage.setItem('showNormalGames', state);
    },
    statsSite(state) {
      localStorage.setItem('statsSite', state);
    },
    showRanksInDetails(state) {
      localStorage.setItem('showRanksInDetails', state);
    },
  },
};
</script>

<style scoped>
.myModal{
    color:#f2ecff;
    height:100vh;
    width:100%;
}
.myModal td {
    padding:10px;
}
</style>
