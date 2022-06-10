<template>
<div v-if="matchDetails != null" className="detailed-match-history" style="display: display, flex: '0 0 100%', width: '0px'">
   <div className="divTable">
      <table cellspacing=0 style="marginLeft: '11px'">
         <tbody className="divTableCell">
            <tr style="backgroundColor: '#101718'">
               <td style="padding: '10px'">{{matchDetails.result}} (Red Team)</td>
               <td>KDA</td>
               <td>Damage</td>
               <td>Wards</td>
               <td>CS</td>
               <td>Items</td>
            </tr>
            <tr v-for="(participant,index) in matchDetails.participants" :key=index :class='`${participant.stats.win ? "Victory" : "Defeat"}`'>
               <td>
                  <div className="aligned">
                     <img style="width:20px;vertical-align:bottom;" :src="CHAMPIONICONURL + participant.championId + '.png'" />
                     {{matchDetails.participantIdentities[index].player.summonerName}}
                  </div>
               </td>
               <td>
                  {{participant.stats.kills}}/{{participant.stats.deaths}}/{{participant.stats.assists}}
               </td>
               <td>
                  <progress style="width:40px;"
                     :title="participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')"
                     :value="participant.stats.totalDamageDealtToChampions/calcTotalDamage(i)*1.5">
                  </progress>
                  <span style="padding:10px;">{{(participant.stats.totalDamageDealtToChampions/calcTotalDamage(i)*100).toFixed(0)}}%</span>
               </td>
               <td>
                  {{participant.stats.visionWardsBoughtInGame}}
                  <br>
                  {{participant.stats.wardsPlaced}} / {{participant.stats.wardsKilled}}
               </td>
               <td>
                  {{participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled}}
               </td>
               <td>
                  <img :src="participant.stats.item1 > 0 ? ITEMICONURL + participant.stats.item1 + '.png' : './assets/0.png'" />
                  <img :src="participant.stats.item0 > 0 ? ITEMICONURL + participant.stats.item0 + '.png' : './assets/0.png'" />
                  <img :src="participant.stats.item2 > 0 ? ITEMICONURL + participant.stats.item2 + '.png' : './assets/0.png'" />
                  <img :src="participant.stats.item3 > 0 ? ITEMICONURL + participant.stats.item3 + '.png' : './assets/0.png'" />
                  <img :src="participant.stats.item4 > 0 ? ITEMICONURL + participant.stats.item4 + '.png' : './assets/0.png'" />
                  <img :src="participant.stats.item5 > 0 ? ITEMICONURL + participant.stats.item5 + '.png' : './assets/0.png'" />
                  <img :src="participant.stats.item6 > 0 ? ITEMICONURL + participant.stats.item6 + '.png' : './assets/0.png'" />
               </td>
            </tr>
         </tbody>
      </table>
   </div>
</div>
</template>

<script>
export default {
    name: "DetailedMatchInfo",
    props: {
        CHAMPIONICONURL: {
            type: String,
            default: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/"
        },
        ITEMICONURL: {
          type: String,
          default: "http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/"
        },
        matchDetails: {
          type: Object
        }
    },
    methods: {
      calcTotalDamage(i){
        // Sum the teammates damage
        // What team are we combining? 
        // the first half (0-4) are team 1
        // the second half (5-9) are team 2
        let totalDamage = 0;
        let j = i < 4 ? 0 : 4;
        let k = i < 4 ? 4 : 9;

        while (j <= k) {
          totalDamage += this.matchDetails.participants[j].stats.totalDamageDealtToChampions
          j += 1
        }

        return totalDamage
      }
    }
}



</script>
<style scoped>
table {
  border-radius: 4px;
  padding:10px;
  width:100%;
  border:none;
}
td{
  padding:0px;
}
.Victory {
  background-color:#3b485e;
}
.Defeat {
  background-color:#8d3f3f;
}
.divTable img{
  width:20px;
  vertical-align:bottom;
}
.aligned {
  padding-left:10px;
  width: max-content;
  text-align:left;
}
th:first-child {
    -moz-border-radius: 6px 0 0 0;
    -webkit-border-radius: 6px 0 0 0;
    border-radius: 6px 0 0 0;
    border-radius: 6px 0 0 0;
}
th:last-child {
    -moz-border-radius: 0 6px 0 0;
    -webkit-border-radius: 0 6px 0 0;
    border-radius: 0 6px 0 0;
    border-radius: 0 6px 0 0;
}
tr:last-child td:last-child {
     border-radius: 0 0 6px 0;
    -moz-border-radius: 0 0 6px 0;
    -webkit-border-radius: 0 0 6px 0;
    border-radius: 0 0 6px 0;
 }
tr:last-child td:first-child {
    -moz-border-radius: 0 0 0 6px;
    -webkit-border-radius: 0 0 0 6px;
    border-radius: 0 0 0 6px;
    border-radius: 0 0 0 6px;
}
</style>