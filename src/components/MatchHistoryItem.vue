<template>
  <div :class='`matchItem ${data.participants[0].stats.win ? "Victory" : "Defeat"}`'>
    <table>
      <tbody>
        <tr>
          <td>
            <div>
              <!-- Gamemode and Preview -->
              <span><b>{{queue}}</b></span>
              <span>{{sinceGame(Date.now()-data.gameCreation)}}</span>
              <hr style="width:10px;">
              <span>{{data.participants[0].stats.win ? "Victory" : "Defeat"}}</span>
              <span>{{gameLengthHR(data.gameDuration)}}</span>
            </div>
          </td>
          <td>
            <div>
              <!-- Icon summoners, and champ name -->
              <div>
                <!-- 2x2 -->
                <table style="display:inline;">
                  <td style="padding:0px;vertical-align:bottom;">
                    <img :src="'http://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/'+champion_name+'.png'" style="width:50px;height:50px">
                    </td>
                   <td style="padding:0px;">
                     <!-- Summoner Spells -->
                      <img :src='`assets/${summonerSpells[data.participants[0].spell1Id]}.webp`' class='thumbicon'>
                      <br>
                      <img :src='`assets/${summonerSpells[data.participants[0].spell2Id]}.webp`' class='thumbicon'>
                    </td>
                    <td style="padding:0px;">
                      <!-- Runes -->
                     <img src="https://pbs.twimg.com/profile_images/1523868254514515970/5CnAiD-0_400x400.jpg" class='thumbicon'>
                     <br>
                     <img src="https://pbs.twimg.com/profile_images/1523868254514515970/5CnAiD-0_400x400.jpg" class='thumbicon'>
                   </td>
                </table>
                <br>
                <span style="font-size:8px;">{{champion_name}}</span>
              </div>
            </div>
          </td>
          <td>
            <!-- K/D/A -->
            <span>K/D/A</span>
            <span>{{data.participants[0].stats.kills}} / {{data.participants[0].stats.deaths}} / {{data.participants[0].stats.assists}}</span>
          </td>
          <td>
            <!-- Personal Stats -->
            <span>Level {{data.participants[0].stats.champLevel}}</span>
            <span>{{totalCS()}} ({{(totalCS()/(data.gameDuration/60)).toFixed(1)}}) CS</span>
             <!-- <span>P/Kill 10%</span> -->
          </td>
          <td>
            <!-- Items -->
            <table>
              <td style="padding:0px;"><img :src="data.participants[0].stats.item0 > 0 ? itemURL+data.participants[0].stats.item0+'.png' : './assets/0.png'" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="data.participants[0].stats.item1 > 0 ? itemURL+data.participants[0].stats.item1+'.png' : './assets/0.png'" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="data.participants[0].stats.item2 > 0 ? itemURL+data.participants[0].stats.item2+'.png' : './assets/0.png'" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="data.participants[0].stats.item3 > 0 ? itemURL+data.participants[0].stats.item3+'.png' : './assets/0.png'" class='thumbicon'></td>
              <tr>
              <td style="padding:0px;"><img :src="data.participants[0].stats.item4 > 0 ? itemURL+data.participants[0].stats.item4+'.png' : './assets/0.png'" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="data.participants[0].stats.item5 > 0 ? itemURL+data.participants[0].stats.item5+'.png' : './assets/0.png'" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="data.participants[0].stats.item6 > 0 ? itemURL+data.participants[0].stats.item6+'.png' : './assets/0.png'" class='thumbicon'></td>
              </tr>
            </table>
            <span style="font-size:8px;">Control Wards {{data.participants[0].stats.visionWardsBoughtInGame}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="showDetailsTip" @click="function(){getGameDetails()}">
      Expand Details
    </div>
    <!-- Begin Detailed Match History Item -->
    <DetailedMatchInfo :matchDetails=matchDetails :style="`display: ${showDetails ? 'inline' : 'none'};`"/>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron')
import DetailedMatchInfo from './DetailedMatchInfo.vue'
export default {
  name: 'MatchHistoryItem',
  components: {
    DetailedMatchInfo
  },
  props: {
    data: {
        type: Object
      },
    champion_name: {
        type: String,
        default: "Champion_Name"
    },
    queue: {
      type: String,
      default: "Undefined"
    },
    CHAMPIONICONURL: {
        type: String,
        default: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/"
    },
    ITEMICONURL: {
      type: String,
      default: "http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/"
    }
  },
  methods:{
    getGameDetails(){
      if(this.matchDetails == null){
        ipcRenderer.send('asynchronous-message', {id:'lol-match-details', gameId: this.data.gameId})
        // Add the Listener for the reply which will be destroyed
        this.matchListener = (event, data) => {
          switch(data.reply_type){
            case "lol-match-details": {
              if(data.gameId == this.data.gameId) {
                this.matchDetails = data
                ipcRenderer.removeListener('asynchronous-reply',this.matchListener)
              }
            }
          }
        }
        ipcRenderer.on('asynchronous-reply', this.matchListener)
      }
      this.showDetails = !this.showDetails
    },
    totalCS() {
      return this.data.participants[0].stats.totalMinionsKilled + this.data.participants[0].stats.neutralMinionsKilled
    },
    gameLengthHR(seconds) {
      seconds = Number(seconds);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor(seconds % (3600 * 24) / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s = Math.floor(seconds % 60);
      const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
      const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours ") : "";
      const mDisplay = m > 0 ? m + (m == 1 ? "m" : "m ") : "";
      const sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay
    },
    sinceGame(seconds) {
      seconds = Number(seconds/1000);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor(seconds % (3600 * 24) / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
      const hDisplay = (h > 0 && !dDisplay) ? h + (h == 1 ? " hour " : " hours ") : "";
      const mDisplay = (m > 0 && !hDisplay && !dDisplay) ? m + (m == 1 ? " minute " : " minutes ") : "";
      return dDisplay + hDisplay + mDisplay + " ago"
    }
  },
  data(){
    return {
      showDetails: false,
      matchListener: null,
      summonerSpells: {
          1: "Cleanse",
          3: "Exhaust",
          4: "Flash",
          6: "Ghost",
          7: "Heal",
          11: "Smite",
          12: "Teleport",
          13: "Clarity",
          14: "Ignite",
          21: "Barrier",
          30: "PoroKing Recall",
          31: "Poro Toss",
          32: "Mark",
          39: "Mark",
      },
      itemURL: "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/item/",
      spellURL: "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/",
      matchDetails: null,
    }
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

td {
  padding: 10px 10px 0px 10px;
}

span {
  display:block;
}

.matchItem {
  background-color:#020202;
  color: #9a96a4;
  border-radius: 5px;
  width:fit-content;
  min-width:600px;
  margin-bottom:8px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.thumbicon {
  width:20px;
  height:20px;
}
.Victory {
  filter: drop-shadow(0 0 0.1rem #5cd7e4);
}
.Defeat {
  filter: drop-shadow(0 0 0.1rem #ba4b45);
}

.Victory b{
  font-weight: normal;
  color: #5cd7e4;
}
.Defeat b{
  font-weight: normal;
  color: #ba4b45;
}
.showDetailsTip {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width:100%;
    font-size:12px;
    text-align:center;
}

.showDetailsTip:hover {
  visibility: visible;
}
</style>
