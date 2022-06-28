<template>
<div v-if="matchDetails != null" className="detailed-match-history" style="display: display, flex: '0 0 100%', width: '0px'">
   <div className="divTable">
      <table cellspacing=0 style="marginLeft: '11px'">
         <tbody className="divTableCell">
            <div v-for="(participant,index) in matchDetails.participants" :key=index :class='`${participant.stats.win ? "Victory" : "Defeat"}`'>
            
            <!-- Recap/Middle Scorecard -->
            <div v-if="index == 5" class="middle-wrapper">
               <!-- top team stats -->
               <div id="ourteam" style="float:left;">
                  <span><img :src="'./assets/baron.png'" class="middle-icon"/>{{matchDetails.teams[getTeamId(0)].baronKills}}</span>
                  <span><img :src="'./assets/dragon.png'" class="middle-icon" style="padding-left:10px;"/>{{matchDetails.teams[getTeamId(0)].dragonKills}}</span>
                  <span><img :src="'./assets/turret.png'" class="middle-icon" style="padding-left:10px;"/>{{matchDetails.teams[getTeamId(0)].towerKills}}</span>
               </div>

               <!-- Total Damage to Champions -->

                  <div :class='`${participant.stats.win ? "Victory" : "Defeat"}`' style="width:190px;display:inline-block;margin-top:4px;">
                     <div 
                     :title="participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')"
                     :class='`${participant.stats.win ? "Defeat" : "Victory"}`' :style="{ height:'10px', width: calcTotalDamage(0)/(calcTotalDamage(0)+calcTotalDamage(5))*100+'%'}">
                     <span style="font-size:10px;display: inherit;line-height: 120%;">{{calcTotalDamage(0).toLocaleString('en-US')}}</span>
                     </div>
                  </div>

               <!-- team1 stats -->
               <div id="enemyteam" style="float:right;">
                  <span><img :src="'./assets/baron.png'" class="middle-icon"/>{{matchDetails.teams[getTeamId(5)].baronKills}}</span>
                  <span><img :src="'./assets/dragon.png'" class="middle-icon" style="padding-left:10px;"/>{{matchDetails.teams[getTeamId(5)].dragonKills}}</span>
                  <span><img :src="'./assets/turret.png'" class="middle-icon" style="padding-left:10px;"/>{{matchDetails.teams[getTeamId(5)].towerKills}}</span>
               </div>
            </div>
            
            <div class="normalScoreboard">

            <!-- Normal Scoreboard Item for Player -->
            <tr>
               <td style="display:inline-block;">
                     <img style="width:25px;height:25px;border-radius:50%;padding-bottom:4px;" :src="CHAMPIONICONURL + participant.championId + '.png'" />
                     <span style="position:relative;left:-25px;font-size:12px;background-color:rgba(8, 8, 8, 0.95);border-radius:50%;">
                        {{formatLevelBulb(participant.stats.champLevel)}}
                     </span>
                        <div style="display:inline-block;width:110px;text-align:left;padding-top:4px;" class="summonername" :title="matchDetails.participantIdentities[index].player.summonerName">{{matchDetails.participantIdentities[index].player.summonerName}}</div>
               </td>
               <td style="width:60px;">
                  {{participant.stats.kills}}/{{participant.stats.deaths}}/{{participant.stats.assists}}
               </td>
               <td style="padding-left:10px;width:100px;">
                  <div class="w3-border" style="float:left;width:40px;display:inline-block;margin-top:4px;">
                     <div 
                     :title="participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')"
                     class="w3-grey" :style="{ height:'10px', width: participant.stats.totalDamageDealtToChampions/calcTotalDamage(index)*150+'%'}"></div>
                  </div>
                  <span style="padding:10px;">{{(participant.stats.totalDamageDealtToChampions/calcTotalDamage(index)*100).toFixed(0)}}%</span>
               </td>
               <td style="width:40px;">
                  <div class="wardText">
                     {{participant.stats.visionWardsBoughtInGame}}
                     <br>
                     {{participant.stats.wardsPlaced}}/{{participant.stats.wardsKilled}}
                  </div>
               </td>
               <td style="width:40px;">
                  {{participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled}}
               </td>
               <td style="padding-left:10px;">
                  <img :src="participant.stats.item1 > 0 ? ITEMICONURL + participant.stats.item1 + '.png' : './assets/0.png'" class="thumbround" />
                  <img :src="participant.stats.item0 > 0 ? ITEMICONURL + participant.stats.item0 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item2 > 0 ? ITEMICONURL + participant.stats.item2 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item3 > 0 ? ITEMICONURL + participant.stats.item3 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item4 > 0 ? ITEMICONURL + participant.stats.item4 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item5 > 0 ? ITEMICONURL + participant.stats.item5 + '.png' : './assets/0.png'" class="thumbround"/>
                  <img :src="participant.stats.item6 > 0 ? ITEMICONURL + participant.stats.item6 + '.png' : './assets/0.png'" class="thumbround"/>
               </td>
            </tr>
            </div>
            </div>
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
         // The order of the teams is done in MatchHistoryItem
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
      getTeamId(index){
         if(this.matchDetails.participants[index].teamId == 100){
            return 0
         }
         else return 1
      }
    }
}



</script>
<style scoped>
.middle-wrapper {
   width:100%;
   height:20px;
   background-color:black;
   padding-top:4px;
   padding-bottom:4px;
}
.w3-border {
   background-color: rgba(198, 194, 194, 0.3);
}
.middle-icon{
   height:15px !important;
   width:15px !important;
   opacity:0.6;
}
.w3-grey {
    background-color:#adb6c4;
}
.w3-red {
   background-color:#8d3f3f;
}
.
.thumbround {
  border-radius:4px;
}
.summonername {
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}
table {
  border-radius: 4px;
  padding:10px;
  width:100%;
  border:none;
}
td{vertical-align:middle;
  padding:0px;
}
.wardText {
   padding:4px;
   font-size:12px;
   line-height:.9;
}
.normalScoreboard {
        padding-left:3px;
  padding-right:3px;
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
  border-radius:4px;
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