<template>
<div v-if="matchDetails != null" className="detailed-match-history" style="display: display, flex: '0 0 100%', width: '0px'">
   <div className="divTable">
      <table cellspacing=0 style="marginLeft: '11px'">
         <tbody className="divTableCell">
            <tr style="backgroundColor: '#101718'">
               <td style="padding: '10px'">(Red Team)</td>
               <td>KDA</td>
               <td>Damage</td>
               <td>Wards</td>
               <td>CS</td>
               <td>Items</td>
            </tr>
            <tr v-for="(participant,index) in matchDetails.participants" :key=index :class='`${participant.stats.win ? "Victory" : "Defeat"}`'>
               <td>
                  <div className="aligned summonername">
                     <img style="width:25px;border-radius:50%;" :src="CHAMPIONICONURL + participant.championId + '.png'" />
                     <span style="    top: 4px;position:relative;left:-25px;font-size:12px;background-color:rgba(8, 8, 8, 0.95);border-radius:50%;">
                        {{formatLevelBulb(participant.stats.champLevel)}}
                     </span>
                     <span :title="matchDetails.participantIdentities[index].player.summonerName" style="left: 50px;height: fit-content;position: absolute;margin-top: 3px;">{{formatName(matchDetails.participantIdentities[index].player.summonerName)}}</span>
                  </div>
               </td>
               <td>
                  {{participant.stats.kills}}/{{participant.stats.deaths}}/{{participant.stats.assists}}
               </td>
               <td>
                  <div class="w3-border" style="float:left;width:40px;display:inline-block;">
                     <div 
                     :title="participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')"
                     class="w3-grey" :style="{ height:'10px', width: participant.stats.totalDamageDealtToChampions/calcTotalDamage(index)*150+'%'}"></div>
                  </div>
                  <span style="padding:10px;">{{(participant.stats.totalDamageDealtToChampions/calcTotalDamage(index)*100).toFixed(0)}}%</span>
               </td>
               <td>
                  <div class="wardText">
                     {{participant.stats.visionWardsBoughtInGame}}
                     <br>
                     {{participant.stats.wardsPlaced}}/{{participant.stats.wardsKilled}}
                  </div>
               </td>
               <td>
                  {{participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled}}
               </td>
               <td>
                  <img :src="participant.stats.item1 > 0 ? ITEMICONURL + participant.stats.item1 + '.png' : './assets/0.png'" class="thumbround" />
                  <img :src="participant.stats.item0 > 0 ? ITEMICONURL + participant.stats.item0 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item2 > 0 ? ITEMICONURL + participant.stats.item2 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item3 > 0 ? ITEMICONURL + participant.stats.item3 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item4 > 0 ? ITEMICONURL + participant.stats.item4 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item5 > 0 ? ITEMICONURL + participant.stats.item5 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item6 > 0 ? ITEMICONURL + participant.stats.item6 + '.png' : './assets/0.png'" class="thumbround"/>
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
      },
      formatLevelBulb(level){
         level = String(level)
         return (level.length < 2) ? "0" + String(level) : level
      },
      formatName(name){
         if(name.length > 10){
            return name.substring(0,9) + "…"
         }
         return name
      }
    }
}



</script>
<style scoped>

.w3-border {
   border-radius:1px;
   background-color: rgba(198, 194, 194, 0.3);
}
.w3-grey {
   border-radius:1px;
    background-color:#adb6c4;
}
.thumbround {
  border-radius:4px;
}
table {
  font-family: 'Fira Code', monospace;
  border-radius: 4px;
  padding:10px;
  width:100%;
  border:none;
}
.summonername {
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   width: 150px !important;
   margin: auto;
}
td{vertical-align:middle;
  padding:0px;
}
.wardText {
   padding:4px;
   font-size:12px;
   line-height:.9;
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
  width: max-content;
  vertical-align:top;
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
progress {
   margin-left: 10px;
   float:left;
}
</style>