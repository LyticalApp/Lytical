<template>
    <div class="myModal">
        <div style="left:50%;margin:auto;align:left;">
            <h1>Settings</h1>
            <table style="left:50%;margin:auto;">
                <tr>
                    <td>Automaticly switch to lobby</td>
                    <td>
                    <input v-model="autoSwitchLobby" type="checkbox"
                     :checked="autoSwitchLobby == 'true'">
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
            </table>
        </div>
        <div>
          <h3>Error Log</h3>
          <textarea v-model="errorlog" class="errorLog"></textarea>
          </div>
    </div>
</template>

<script>
export default {
  name: 'SettingsMenu',
  mounted() {
    // Load settings because localStorage isn't ready until mount
    if (localStorage.autoSwitchLobby) this.autoSwitchLobby = localStorage.getItem('autoSwitchLobby');
    if (localStorage.statsSite) this.statsSite = localStorage.getItem('statsSite');
    if (localStorage.showSoloGames) this.showSoloGames = localStorage.getItem('showSoloGames');
    if (localStorage.showFlexGames) this.showFlexGames = localStorage.getItem('showFlexGames');
    if (localStorage.showNormalGames) this.showNormalGames = localStorage.getItem('showNormalGames');
    window.onerror = (errorMsg, url, lineNumber) => {
      this.errorlog += `Error occured: ${errorMsg} on line ${lineNumber} \n`;
      return false;
    };
  },
  data() {
    return {
      errorlog: '',
      autoSwitchLobby: 'true',
      statsSite: 'opgg',
      showSoloGames: 'true',
      showFlexGames: 'true',
      showNormalGames: 'true',
    };
  },
  watch: {
    // Keep local storage in sync
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
  },
};
</script>

<style scoped>
.errorLog {
  background-color:#2c3e50;
  width:50%;
  color:white;
}
.myModal{
    color:#f2ecff;
    height:100vh;
    width:100%;
}
.myModal td {
    padding:10px;
}
</style>
