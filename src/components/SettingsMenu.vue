<template>
    <div class="myModal">
        <div style="left:50%;margin:auto;">
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
                        <option value="opgg" link="https://op.gg/champions">op.gg</option>
                        <option value="ugg" link="https://u.gg/lol/champions">u.gg</option>
                        <option value="blitz" link="https://blitz.gg/lol/champions/">blitz.gg</option>
                        <option value="leagueofgraphs"
                        link="https://www.leagueofgraphs.com/champions/">leagueofgraphs</option>
                        <option value="qq" link="https://101.qq.com/#/hero">qq</option>
                    </select>
                </td>
                </tr>
            </table>
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
  },
  data() {
    return {
      autoSwitchLobby: 'false',
      statsSite: 'op.gg',
    };
  },
  watch: {
    // Keep local storage in sync
    autoSwitchLobby(state) {
      localStorage.setItem('autoSwitchLobby', state);
    },
    statsSite(state) {
      localStorage.setItem('statsSite', state);
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
