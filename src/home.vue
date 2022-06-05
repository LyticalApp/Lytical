<template>
  <div v-show='showError' style="background-color:red">
    <h1>LCU Disconnected</h1>
  </div>
  <form @submit.prevent="searchSummoner()">
    <input v-model=summonerSearch placeholder="Search Summoner">
    <input type="submit" value="Submit">
    </form>
  <button @click="searchSummoner()">Refresh</button>
  <button @click="changeRoute('/pregame')">pregame</button>
  <table class="container">
    <td>
    <PlayerCard :data=playerCardInfo />
    </td>
    <td>
    <MatchHistoryItem v-for="match in matches"
      :key=match.gameId
      :data=match 
      :champion_name=championIds[match.participants[0].championId]
      :queue=queueIds[match.queueId]
      />
    </td>
    </table>
</template>

<script>
// PUUID 74701d6a-61f7-51d7-8746-948ce4a23f81

import MatchHistoryItem from './components/MatchHistoryItem.vue'
import PlayerCard from './components/PlayerCard.vue'
const { ipcRenderer } = require('electron')
import { queueIds, championIds } from './common.js'

export default {
  name: 'HomeView',
  components: {
    MatchHistoryItem,
    PlayerCard
  },
  data(){
    return{
      queueIds: queueIds,
      championIds: championIds,
      polling: null,
      ondata: null,
      summonerSearch: '',
      showError: false,
      playerCardInfo: {},
      matches: {},
    }
  },

  methods: {
    changeRoute(route){
      // Unregister the listener..
      ipcRenderer.removeListener('asynchronous-reply',this.ondata)
      clearInterval(this.polling)
      this.$router.push(route)
    },
    searchSummoner(){
      ipcRenderer.send('asynchronous-message', {id:'lol-ranked-stats', user: this.summonerSearch})
      ipcRenderer.send('asynchronous-message', {id:'lol-match-history', user: this.summonerSearch, begIndex: 0, endIndex: 9})
    }
  },
  created: function () {
    // First run only
    this.ondata = (event, data) => {

      // Dug
      console.log("DEBUG: Async Reply: ",data)

      // All replies should have a reply_type set.
      if(data.reply_type == undefined){
        console.log("ERROR UNSET REPLY_TYPE in DATA")
        return
      }

      // We have diconnected or auth error..
      if(data.reply_type == "lcu-disonnceted") {
        this.showError = true
        return
      } else {
        this.showError = false
      }

      // Valid reply handlers
      switch(data.reply_type){
        case "current-summoner": {
          this.matches = data.games.games
          break
        }
        case "lol-match-history": {
          this.matches = data.games.games
          break
        }
        case "lol-ranked-stats": {
          this.playerCardInfo = data
          break
        }
        case "lol-champ-select": {
          // We switch to the other view for
          // pregame lobbies which will
          // display player cards for each player
          this.changeRoute('/pregame')
          break
        }
        default: {
          console.error("Handling for", data.reply_type, "is not implemented" )
          break
        }
      }
    }

    ipcRenderer.on('asynchronous-reply', this.ondata)

    this.summonerSearch = "Cropster"
    this.searchSummoner()

    // Poll for champion select state
    this.polling = setInterval(function() {
      ipcRenderer.send('asynchronous-message', {id:'lol-champ-select'})
    }, 15000)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
