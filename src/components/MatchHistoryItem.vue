<template>
  <div :class='`matchItem ${data.participants[0].stats.win ? "Victory" : "Defeat"}`'>
    <table>
        <tbody>
          <tr>
              <td style="width:100px;">
                <div>
                    <!-- Gamemode and Preview -->
                    <span><b>{{queue}}</b></span>
                    <span style="font-size:10px;">{{sinceGame(Date.now()-data.gameCreation)}}</span>
                    <div style="margin:auto;width:40px;border-top: 1px solid #5a4656;margin-top:4px;margin-bottom:4px;"></div>
                    <span style="font-size:12px;">{{data.participants[0].stats.win ? "Victory" : "Defeat"}}</span>
                    <span style="font-size:14px;">{{gameLengthHR(data.gameDuration)}}</span>
                </div>
              </td>
              <td>
                <div>
                    <!-- Icon summoners, and champ name -->
                    <div>
                      <!-- 2x2 -->
                      <table style="display:inline;">
                          <td style="padding:0px;vertical-align:bottom;">
                            <img :src="'http://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/'+champion_name+'.png'" style="width:50px;height:50px;border-radius:50%;">
                          </td>
                          <td style="padding:0px;">
                            <!-- Summoner Spells -->
                            <img :src='`assets/${summonerSpells[data.participants[0].spell1Id]}.webp`' class='thumbicon thumbround'>
                            <br>
                            <img :src='`assets/${summonerSpells[data.participants[0].spell2Id]}.webp`' class='thumbicon thumbround'>
                          </td>
                          <td style="padding:0px;">
                            <!-- Runes -->
                            <img :src="'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/'+runeMap[data.participants[0].stats.perk0]" class='thumbicon thumbround'>
                            <br>
                            <img :src="'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/'+runeMap[data.participants[0].stats.perkSubStyle]" class='thumbicon thumbround'>
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
                    <td style="padding:0px;"><img :src="data.participants[0].stats.item0 > 0 ? itemURL+data.participants[0].stats.item0+'.png' : './assets/0.png'" class='thumbicon thumbround'></td>
                    <td style="padding:0px;"><img :src="data.participants[0].stats.item1 > 0 ? itemURL+data.participants[0].stats.item1+'.png' : './assets/0.png'" class='thumbicon thumbround'></td>
                    <td style="padding:0px;"><img :src="data.participants[0].stats.item2 > 0 ? itemURL+data.participants[0].stats.item2+'.png' : './assets/0.png'" class='thumbicon thumbround'></td>
                    <td style="padding:0px;"><img :src="data.participants[0].stats.item3 > 0 ? itemURL+data.participants[0].stats.item3+'.png' : './assets/0.png'" class='thumbicon thumbround'></td>
                    <tr>
                      <td style="padding:0px;"><img :src="data.participants[0].stats.item4 > 0 ? itemURL+data.participants[0].stats.item4+'.png' : './assets/0.png'" class='thumbicon thumbround'></td>
                      <td style="padding:0px;"><img :src="data.participants[0].stats.item5 > 0 ? itemURL+data.participants[0].stats.item5+'.png' : './assets/0.png'" class='thumbicon thumbround'></td>
                      <td style="padding:0px;"><img :src="data.participants[0].stats.item6 > 0 ? itemURL+data.participants[0].stats.item6+'.png' : './assets/0.png'" class='thumbicon thumbround'></td>
                    </tr>
                </table>
                <span style="font-size:8px;">Control Wards {{data.participants[0].stats.visionWardsBoughtInGame}}</span>
              </td>
          </tr>
        </tbody>
    </table>
    <div :class="`showDetailsTip ${showDetails ? 'flip180' : ''}`" @click="function(){getGameDetails()}">
        <i class="fa-solid fa-angle-down"></i>
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
      runeMap: {
          8100 : 'perk-images/styles/7200_domination.png',
          8112 : 'perk-images/styles/domination/electrocute/electrocute.png',
          8124 : 'perk-images/styles/domination/predator/predator.png',
          8128 : 'perk-images/styles/domination/darkharvest/darkharvest.png',
          9923 : 'perk-images/styles/domination/hailofblades/hailofblades.png',
          8126 : 'perk-images/styles/domination/cheapshot/cheapshot.png',
          8139 : 'perk-images/styles/domination/tasteofblood/greenterror_tasteofblood.png',
          8143 : 'perk-images/styles/domination/suddenimpact/suddenimpact.png',
          8136 : 'perk-images/styles/domination/zombieward/zombieward.png',
          8120 : 'perk-images/styles/domination/ghostporo/ghostporo.png',
          8138 : 'perk-images/styles/domination/eyeballcollection/eyeballcollection.png',
          8135 : 'perk-images/styles/domination/treasurehunter/treasurehunter.png',
          8134 : 'perk-images/styles/domination/ingenioushunter/ingenioushunter.png',
          8105 : 'perk-images/styles/domination/relentlesshunter/relentlesshunter.png',
          8106 : 'perk-images/styles/domination/ultimatehunter/ultimatehunter.png',
          8300 : 'perk-images/styles/7203_whimsy.png',
          8351 : 'perk-images/styles/inspiration/glacialaugment/glacialaugment.png',
          8360 : 'perk-images/styles/inspiration/unsealedspellbook/unsealedspellbook.png',
          8369 : 'perk-images/styles/inspiration/firststrike/firststrike.png',
          8306 : 'perk-images/styles/inspiration/hextechflashtraption/hextechflashtraption.png',
          8304 : 'perk-images/styles/inspiration/magicalfootwear/magicalfootwear.png',
          8313 : 'perk-images/styles/inspiration/perfecttiming/perfecttiming.png',
          8321 : 'perk-images/styles/inspiration/futuresmarket/futuresmarket.png',
          8316 : 'perk-images/styles/inspiration/miniondematerializer/miniondematerializer.png',
          8345 : 'perk-images/styles/inspiration/biscuitdelivery/biscuitdelivery.png',
          8347 : 'perk-images/styles/inspiration/cosmicinsight/cosmicinsight.png',
          8410 : 'perk-images/styles/resolve/approachvelocity/approachvelocity.png',
          8352 : 'perk-images/styles/inspiration/timewarptonic/timewarptonic.png',
          8000 : 'perk-images/styles/7201_precision.png',
          8005 : 'perk-images/styles/precision/presstheattack/presstheattack.png',
          8008 : 'perk-images/styles/precision/lethaltempo/lethaltempotemp.png',
          8021 : 'perk-images/styles/precision/fleetfootwork/fleetfootwork.png',
          8010 : 'perk-images/styles/precision/conqueror/conqueror.png',
          9101 : 'perk-images/styles/precision/overheal.png',
          9111 : 'perk-images/styles/precision/triumph.png',
          8009 : 'perk-images/styles/precision/presenceofmind/presenceofmind.png',
          9104 : 'perk-images/styles/precision/legendalacrity/legendalacrity.png',
          9105 : 'perk-images/styles/precision/legendtenacity/legendtenacity.png',
          9103 : 'perk-images/styles/precision/legendbloodline/legendbloodline.png',
          8014 : 'perk-images/styles/precision/coupdegrace/coupdegrace.png',
          8017 : 'perk-images/styles/precision/cutdown/cutdown.png',
          8299 : 'perk-images/styles/sorcery/laststand/laststand.png',
          8400 : 'perk-images/styles/7204_resolve.png',
          8437 : 'perk-images/styles/resolve/graspoftheundying/graspoftheundying.png',
          8439 : 'perk-images/styles/resolve/veteranaftershock/veteranaftershock.png',
          8465 : 'perk-images/styles/resolve/guardian/guardian.png',
          8446 : 'perk-images/styles/resolve/demolish/demolish.png',
          8463 : 'perk-images/styles/resolve/fontoflife/fontoflife.png',
          8401 : 'perk-images/styles/resolve/mirrorshell/mirrorshell.png',
          8429 : 'perk-images/styles/resolve/conditioning/conditioning.png',
          8444 : 'perk-images/styles/resolve/secondwind/secondwind.png',
          8473 : 'perk-images/styles/resolve/boneplating/boneplating.png',
          8451 : 'perk-images/styles/resolve/overgrowth/overgrowth.png',
          8453 : 'perk-images/styles/resolve/revitalize/revitalize.png',
          8242 : 'perk-images/styles/sorcery/unflinching/unflinching.png',
          8200 : 'perk-images/styles/7202_sorcery.png',
          8214 : 'perk-images/styles/sorcery/summonaery/summonaery.png',
          8229 : 'perk-images/styles/sorcery/arcanecomet/arcanecomet.png',
          8230 : 'perk-images/styles/sorcery/phaserush/phaserush.png',
          8224 : 'perk-images/styles/sorcery/nullifyingorb/pokeshield.png',
          8226 : 'perk-images/styles/sorcery/manaflowband/manaflowband.png',
          8275 : 'perk-images/styles/sorcery/nimbuscloak/6361.png',
          8210 : 'perk-images/styles/sorcery/transcendence/transcendence.png',
          8234 : 'perk-images/styles/sorcery/celerity/celeritytemp.png',
          8233 : 'perk-images/styles/sorcery/absolutefocus/absolutefocus.png',
          8237 : 'perk-images/styles/sorcery/scorch/scorch.png',
          8232 : 'perk-images/styles/sorcery/waterwalking/waterwalking.png',
          8236 : 'perk-images/styles/sorcery/gatheringstorm/gatheringstorm.png',
      },
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

.thumbround {
  border-radius:4px;
}

td {
  padding: 10px 10px 10px 10px;
}

span {
  display:block;
}

.matchItem {
  transition: all 3s ease-in-out;
  background-color:#020202;
  color: #9a96a4;
  border-radius: 5px;
  width:fit-content;
  min-width:570px;
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
    position: absolute;
    z-index: 0;
    width: fit-content;
    right: 18px;
    top: 70px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size:12px;
    text-align:center;
}
.flip180 {
  transform: rotate(180deg);
}
</style>
