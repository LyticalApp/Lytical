<template>
   <div v-if="matchDetails != null" className="detailed-match-history" style="display: display, flex: '0 0 100%', width: '0px'">
      <div className="divTable">
         <table cellspacing=0 style="marginLeft: '11px'   border-radius: 4px;
            padding:10px;
            width:100%;
            border:none;">
            <tbody className="divTableCell">
               <div class="topItem" style="display:flex;margin:auto;background-color:#31313c;font-weight: 50;font-family: Roboto, sans-serif;font-size:14px;height:20px;padding-top:4px;">
                  <span style="padding-left:20px;" :style='`
                     ${matchDetails.participants[0].stats.win ? "color:#5383e8;" : "color:#e84057;"}`'>{{matchDetails.participants[0].stats.win ? "Victory" : "Defeat"}} 
                  </span><span>&nbsp;({{matchDetails.participants[0].teamId == 200 ? "Red Team" : "Blue Team"}})</span>
                  <span style="padding-left:90px;">KDA</span>
                  <span style="padding-left:40px;">Damage</span>
                  <span style="padding-left:20px;">Wards</span>
                  <span style="padding-left:20px;">CS</span>
                  <span style="padding-left:60px;">Items</span>
               </div>
               <div v-for="(participant,index) in matchDetails.participants" :key=index :class='`
                  ${participant.stats.win ? "Victory" : "Defeat"} 
                  ${(index == 5) ? "topItem" : ""}
                  ${(index == 9) ? "bottomItem" : ""}
                  `'>
                  <!-- Recap/Middle Scorecard -->
                  <div v-if="index == 5" class="middle-wrapper">
                     <!-- top team stats -->
                     <div id="ourteam" style="float:left;">
                        <span><img :src="'./assets/baron.png'" class="middle-icon"/>{{matchDetails.teams[getTeamId(0)].baronKills}}</span>
                        <span><img :src="'./assets/dragon.png'" class="middle-icon" style="padding-left:10px;"/>{{matchDetails.teams[getTeamId(0)].dragonKills}}</span>
                        <span><img :src="'./assets/turret.png'" class="middle-icon" style="padding-left:10px;"/>{{matchDetails.teams[getTeamId(0)].towerKills}}</span>
                        <span><img :src="'./assets/gold.png'" class="middle-icon" style="padding-left:10px;"/>{{(calcTotalGold(0)/1000).toFixed(1)}}k</span>
                     </div>
                     <!-- Total Kills -->
                     <div style="display:inline;">
                        <span style="font-size:10px;line-height: 120%;margin:0 auto;position:absolute;padding-left:70px;padding-top:4px;">Total Kills</span>
                        <div :class='`${participant.stats.win ? "Victory" : "Defeat"}`' style="width:190px;display:inline-block;margin-top:4px;">
                           <span style="font-size:10px;line-height: 120%;float:right;">{{calcTotalKills(5).toLocaleString('en-US')}}</span>
                           <div :class='`${participant.stats.win ? "Defeat" : "Victory"}`' :style="{ height:'12px', width: calcTotalKills(0)/(calcTotalKills(0)+calcTotalKills(5))*100+'%'}">
                              <span style="font-size:10px;float:left;">{{calcTotalKills(0).toLocaleString('en-US')}}</span>
                           </div>
                        </div>
                     </div>
                     <!-- bottom team stats -->
                     <div id="enemyteam" style="float:right;">
                        <span><img :src="'./assets/baron.png'" class="middle-icon"/>{{matchDetails.teams[getTeamId(5)].baronKills}}</span>
                        <span><img :src="'./assets/dragon.png'" class="middle-icon" style="padding-left:10px;"/>{{matchDetails.teams[getTeamId(5)].dragonKills}}</span>
                        <span><img :src="'./assets/turret.png'" class="middle-icon" style="padding-left:10px;"/>{{matchDetails.teams[getTeamId(5)].towerKills}}</span>
                        <span><img :src="'./assets/gold.png'" class="middle-icon" style="padding-left:10px;"/>{{(calcTotalGold(5)/1000).toFixed(1)}}k</span>
                     </div>
                     <div class="topItem" style="display:flex;margin:auto;background-color:#31313c;font-weight: 50;font-family: Roboto, sans-serif;font-size:14px;height:20px;padding-top:4px;">
                        <span style="padding-left:20px;" :style='`${matchDetails.participants[5].stats.win ? "color:#5383e8;" : "color:#e84057;"}`'>
                           {{matchDetails.participants[5].stats.win ? "Victory" : "Defeat"}} 
                        </span>
                        <span>
                           &nbsp;({{matchDetails.participants[5].teamId == 200 ? "Red Team" : "Blue Team"}})
                        </span>
                        <span style="padding-left:90px;">KDA</span>
                        <span style="padding-left:40px;">Damage</span>
                        <span style="padding-left:20px;">Wards</span>
                        <span style="padding-left:20px;">CS</span>
                        <span style="padding-left:60px;">Items</span>
                     </div>
                  </div>
                  <div class="normalScoreboard">
                     <!-- Normal Scoreboard Item for Player -->
                     <tr>
                        <td style="display:inline-block;">
                           <img style="width:30px;height:30px;border-radius:50%;padding-bottom:4px;" :src="CHAMPIONICONURL + participant.championId + '.png'" />
                           <table style="display:inline;">
                              <td style="padding:0px;">
                                 <!-- Summoner Spells -->
                                 <img :src='`assets/${summonerSpells[participant.spell1Id]}.webp`' class='thumbicon thumbround' style="height:15px;width:15px;">
                                 <br>
                                 <img :src='`assets/${summonerSpells[participant.spell2Id]}.webp`' class='thumbicon thumbround' style="height:15px;width:15px;">
                              </td>
                              <td style="padding:0px;">
                                 <!-- Runes -->
                                 <img :src="'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/'+runeMap[participant.stats.perk0]" class='thumbicon thumbround' style="height:15px;width:15px;">
                                 <br>
                                 <img :src="'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/'+runeMap[participant.stats.perkSubStyle]" class='thumbicon thumbround' style="height:15px;width:15px;">
                              </td>
                           </table>
                           <span style="position:absolute;left:12px;font-size:12px;background-color:rgba(8, 8, 8, 0.95);border-radius:50%;margin-top:25px;">
                           {{formatLevelBulb(participant.stats.champLevel)}}
                           </span>
                           <div style="display:inline-block;width:75px;text-align:left;padding-top:4px;" class="summonername" :title="matchDetails.participantIdentities[index].player.summonerName">
                              <span style="font-size:12px;">{{matchDetails.participantIdentities[index].player.summonerName}}</span><br>
                              <span style="font-size:11px;">{{participant.timeline.lane}}</span>
                           </div>
                        </td>
                        <td style="width:70px;font-size:12px;">
                           <span>{{participant.stats.kills}}/{{participant.stats.deaths}}/{{participant.stats.assists}} ({{(((participant.stats.kills + participant.stats.assists)/calcTotalKills(index))*100).toFixed(0)}}%)</span>
                           <br>
                           <b>{{((participant.stats.kills + participant.stats.assists)/participant.stats.deaths).toFixed(2)}}:1</b>
                        </td>
                        <td style="padding-left:10px;width:100px;font-size:12px;">
                           <div>
                              <span style="float:left;">{{participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')}}</span>
                              {{participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')}}
                           </div>
                           <div>
                              <div class="w3-border" style="float:left;width:40px;display:inline-block;margin-top:4px;">
                                 <div 
                                    :title="participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')"
                                    class="w3-grey" :style="{ height:'6px', width: participant.stats.totalDamageDealtToChampions/calcTotalDamage(index)*150+'%'}"></div>
                              </div>
                              <div class="w3-border" style="float:left;width:40px;display:inline-block;margin-top:4px;margin-left:10px;">
                                 <div 
                                    :title="participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')"
                                    :style="{ backgroundColor: '#7b7a8e', height:'6px', width: participant.stats.totalDamageDealtToChampions/calcTotalDamage(index)*150+'%'}"></div>
                              </div>
                           </div>
                        </td>
                        <td style="width:30px;">
                           <div class="wardText">
                              {{participant.stats.visionWardsBoughtInGame}}
                              <br>
                              {{participant.stats.wardsPlaced}}/{{participant.stats.wardsKilled}}
                           </div>
                        </td>
                        <td style="width:40px;">
                           <span style="font-size:12px;display: block;">
                           {{participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled}}
                           {{((participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled)/(matchDetails.gameDuration/60)).toFixed(1)}}/m
                           </span>
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
      calcTotalDamage(index){
         let totalDamage = 0;
         for (let player of this.matchDetails.participants){
            if(player.teamId == this.matchDetails.participants[index].teamId){
               totalDamage += player.stats.totalDamageDealtToChampions
            }
            
         }
        return totalDamage
      },
      calcTotalGold(index){
         let totalGold = 0;
         for (let player of this.matchDetails.participants){
            if(player.teamId == this.matchDetails.participants[index].teamId){
               totalGold += player.stats.goldEarned
            }
         }
         return totalGold
      },
      calcTotalKills(index){
         let totalKills = 0;
         for (let player of this.matchDetails.participants){
            if(player.teamId == this.matchDetails.participants[index].teamId){
               totalKills += player.stats.kills
            }
         }
         return totalKills
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
    },
    data(){
       return {
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
       }
    }
}



</script>
<style scoped>
.middle-wrapper {
   padding-top:5px;
   width:100%;
   background-color:#282830   ;
}
.w3-border {
   background-color: #31313c;
}
.middle-icon{
   height:15px !important;
   width:15px !important;
   opacity:0.6;
}
.w3-grey {
    background-color:#e84057;
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
  background-color:#28344e;
}
.Defeat {
  background-color:#59343b;
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

.topItem{
   border-top-right-radius: 4px;
   border-top-left-radius: 4px;
}

.bottomItem{
   border-bottom-right-radius: 4px;
   border-bottom-left-radius: 4px;
}

progress {
   margin-left: 10px;
   float:left;
}
</style>