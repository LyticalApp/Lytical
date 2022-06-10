<template>
<div class="wrapper">
  <div v-show='showError' style="background-color:red">
    <h1>LCU Disconnected</h1>
  </div>
  <table class="container" style="vertical-align: top;">
    <td>
      <div id="leftSideBar">
        <PlayerCard :data=playerCardInfo />
        <PlayerRank :data=playerCardInfo />
      </div>
    </td>
    <td>
      <div v-if="!matches.length" class="loadingFrame">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
      <MatchHistoryItem v-for="match in matches"
        :key=match.gameId
        :data=match 
        :champion_name=championIds[match.participants[0].championId]
        :queue=queueIds[match.queueId]
        />
    </td>
    </table>
    </div>
</template>

<script>

import MatchHistoryItem from './components/MatchHistoryItem.vue'
import PlayerCard from './components/PlayerCard.vue'
import PlayerRank from './components/PlayerRank.vue'
import { queueIds, championIds } from './res/common.js'
const { ipcRenderer } = require('electron')

export default {
  name: 'HomeView',
  components: {
    MatchHistoryItem,
    PlayerCard,
    PlayerRank,
  },
  data(){
    return{
      queueIds: queueIds,
      championIds: championIds,
      polling: null,
      ondata: null,
      showError: false,
      playerCardInfo: {},
      matches: {},
    }
  },
  watch:{
      $route (){
        // Unregister the listener..
        console.log("Unregistering Listeners on Home")
        ipcRenderer.removeListener('asynchronous-reply',this.ondata)
        clearInterval(this.polling)
      }
  },
  methods: {
    searchSummoner(summonerName){
      ipcRenderer.send('asynchronous-message', {id:'lol-ranked-stats', user: summonerName})
      ipcRenderer.send('asynchronous-message', {id:'lol-match-history', user: summonerName, begIndex: 0, endIndex: 9})
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
          this.$router.push("pregame")
          break
        }
        default: {
          console.error("Handling for", data.reply_type, "is not implemented" )
          break
        }
      }
    }


    if(this.$route.params.summonerSearch == undefined || this.$route.params.summonerSearch == ""){
      this.searchSummoner("Cropster")
    } else if(this.$route.params.submitSearch == "true"){
      this.searchSummoner(this.$route.params.summonerSearch)
    }

    ipcRenderer.on('asynchronous-reply', this.ondata)

    // Poll for champion select state
    this.polling = setInterval(function() {
      ipcRenderer.send('asynchronous-message', {id:'lol-champ-select'})
    }, 15000)
  }
}
</script>

<style>
body{
  background-color:#080808;
}

body::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
}
body::-webkit-scrollbar-track {
    background: #080808 !important;
}
body::-webkit-scrollbar-thumb {
    background-color: #787878 !important;
    border: none;
    border-radius: 10px !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#leftSideBar {
  width: 300px;
}
.loadingFrame{
  margin:auto;
  width:605px;
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
.wrapper {
    margin:auto;
    width:50%;
    display: flex;
    justify-content: center;
}

</style>
