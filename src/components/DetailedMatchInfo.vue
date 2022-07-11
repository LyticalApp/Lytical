<template>
   <div v-if="matchDetails != null" className="detailed-match-history">
      <div className="divTable">
         <table cellspacing=0 style="padding:2px;">
            <tbody className="divTableCell">
               <!-- Team 0 title bar/column labels -->
               <div class="topItem header-bar">
                  <div style="float:left;padding-left:10px;position:absolute;">
                  <span :style='`
                     ${matchDetails.participants[0].stats.win ? "color:#5383e8;" : "color:#e84057;"}`'>
                     <b>{{matchDetails.participants[0].stats.win ? "Victory" : "Defeat"}}</b>
                  </span><span>&nbsp;({{matchDetails.participants[0].teamId == 200 ? "Red Team" : "Blue Team"}})</span>
                  </div>
                  <span style="left:175px;position:absolute;">KDA</span>
                  <span style="left:260px;position:absolute;">Damage</span>
                  <span style="left:337px;position:absolute;">Wards</span>
                  <span style="left:385px;position:absolute;">CS</span>
                  <span style="left:465px;position:absolute;">Items</span>
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
                        <span>&nbsp;&nbsp;
                           <img :src="'./assets/baron.png'" class="middle-icon"/>
                           &nbsp;{{matchDetails.teams[getTeamId(0)].baronKills}}</span>
                        <span>
                           <img :src="'./assets/dragon.png'" class="middle-icon" style="padding-left:8px;"/>
                           &nbsp;{{matchDetails.teams[getTeamId(0)].dragonKills}}</span>
                        <span>
                           <img :src="'./assets/turret.png'" class="middle-icon" style="padding-left:8px;"/>
                           &nbsp;{{matchDetails.teams[getTeamId(0)].towerKills}}</span>
                        <span>
                           <img :src="'./assets/gold.png'" class="middle-icon" style="padding-left:8px;"/>
                           &nbsp;{{(calcTotalGold(0)/1000).toFixed(1)}}k</span>
                     </div>
                     <!-- Total Kills -->
                     <div style="display:inline;color:#f2ecff;">
                        <span class="totalKillsLabel">
                           Total Kills</span>
                        <div :class='`${participant.stats.win ? "accentBlue" : "accentRed"}`'
                        style="width:190px;display:inline-block;margin-top:2px;">
                           <span style="font-size:10px;line-height: 120%;float:right;padding-right:4px;">
                              {{calcTotalKills(5).toLocaleString('en-US')}}</span>
                           <div :class='`${participant.stats.win ? "accentRed" : "accentBlue"}`'
                           :style="{ height:'12px',
                           width: calcTotalKills(0)/(calcTotalKills(0)+calcTotalKills(5))*100+'%'}">
                              <span style="font-size:10px;float:left;padding-left:4px;">
                                 {{calcTotalKills(0).toLocaleString('en-US')}}</span>
                           </div>
                        </div>
                     </div>
                     <!-- bottom team stats -->
                     <div id="enemyteam" style="float:right;">
                        <span>
                           <img :src="'./assets/baron.png'" class="middle-icon"/>
                           &nbsp;{{matchDetails.teams[getTeamId(5)].baronKills}}</span>
                        <span>
                           <img :src="'./assets/dragon.png'" class="middle-icon" style="padding-left:8px;"/>
                           &nbsp;{{matchDetails.teams[getTeamId(5)].dragonKills}}</span>
                        <span>
                           <img :src="'./assets/turret.png'" class="middle-icon" style="padding-left:8px;"/>
                           &nbsp;{{matchDetails.teams[getTeamId(5)].towerKills}}</span>
                        <span>
                           <img :src="'./assets/gold.png'" class="middle-icon" style="padding-left:8px;"/>
                           &nbsp;{{(calcTotalGold(5)/1000).toFixed(1)}}k&nbsp;&nbsp;</span>
                     </div>
                  </div>
               <!-- Team 1 title bar/column labels -->
               <div v-if="index == 5" class="header-bar">
                  <div style="float:left;padding-left:10px;position:absolute;">
                  <span :style='`
                     ${matchDetails.participants[5].stats.win ? "color:#5383e8;" : "color:#e84057;"}`'>
                     <b>{{matchDetails.participants[5].stats.win ? "Victory" : "Defeat"}}</b>
                  </span><span>&nbsp;({{matchDetails.participants[5].teamId == 200 ? "Red Team" : "Blue Team"}})</span>
                  </div>
                  <span style="left:175px;position:absolute;">KDA</span>
                  <span style="left:260px;position:absolute;">Damage</span>
                  <span style="left:337px;position:absolute;">Wards</span>
                  <span style="left:385px;position:absolute;">CS</span>
                  <span style="left:465px;position:absolute;">Items</span>
               </div>
                  <div class="normalScoreboard">
                     <!-- Normal Scoreboard Item for Player -->
                     <tr>
                        <td style="display:inline-block;">
                           <img @click="openLink(
                              'https://na.op.gg/champions/'+championIds[participant.championId]
                              )"
                              style="width:30px;height:30px;border-radius:50%;padding-bottom:4px;"
                              :src="CHAMPIONICONURL + participant.championId + '.png'" />
                           <table style="display:inline;">
                              <td style="padding:0px;">
                                 <!-- Summoner Spells -->
                                 <img :src='`assets/${summonerSpells[participant.spell1Id]}.webp`'
                                 class='thumbicon thumbround' style="height:15px;width:15px;">
                                 <br>
                                 <img :src='`assets/${summonerSpells[participant.spell2Id]}.webp`'
                                 class='thumbicon thumbround' style="height:15px;width:15px;">
                              </td>
                              <td style="padding:0px;">
                                 <!-- Runes -->
                                 <img :src="RUNEICONURL+runeIcons[participant.stats.perk0]"
                                 class='thumbicon thumbround' style="height:15px;width:15px;">
                                 <br>
                                 <img :src="RUNEICONURL+runeIcons[participant.stats.perkSubStyle]"
                                 class='thumbicon thumbround' style="height:15px;width:15px;">
                              </td>
                           </table>
                           <span class="championLeveLBulb">
                           {{formatLevelBulb(participant.stats.champLevel)}}
                           </span>
                           <div style="display:inline-block;width:75px;text-align:left;padding-top:4px;"
                           class="summonername" :title="matchDetails.participantIdentities[index].player.summonerName">
                              <span style="font-size:12px;color:#f2ecff;"
                              @click="searchPlayer(matchDetails.participantIdentities[index].player.summonerName)">
                              {{matchDetails.participantIdentities[index].player.summonerName}}</span><br>
                              <span style="font-size:11px;">{{participant.timeline.lane}}</span>
                           </div>
                        </td>
                        <td style="width:75px;font-size:11px;">
                           <span>
                              {{participant.stats.kills}}/{{participant.stats.deaths}}/{{participant.stats.assists}}
                               ({{(((participant.stats.kills +
                               participant.stats.assists)/calcTotalKills(index))*100).toFixed(0)}}%)</span>
                           <br>
                           <b><span :style="{ color: getKDAStyle(
                              ((participant.stats.kills +
                              participant.stats.assists)/participant.stats.deaths)),
                              fontSize: '10px'}">
                              {{((participant.stats.kills + participant.stats.assists)
                              /participant.stats.deaths).toFixed(2)}}:1</span></b>
                        </td>
                        <td style="padding-left:10px;width:100px;font-size:12px;">
                           <div>
                              <span style="float:left;">
                                 {{participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')}}</span>
                              {{participant.stats.totalDamageTaken.toLocaleString('en-US')}}
                           </div>
                           <div>
                              <div class="w3-border" style="float:left;width:40px;display:inline-block;margin-top:4px;">
                                 <div
                                    :title="participant.stats.totalDamageDealtToChampions.toLocaleString('en-US')"
                                    class="w3-grey"
                                    :style="{ height:'6px',
                                    width: participant.stats.totalDamageDealtToChampions/calcTotalDamage(index)*180+'%'
                                    }"></div>
                              </div>
                              <div class="w3-border"
                              style="float:left;width:40px;display:inline-block;margin-top:4px;margin-left:10px;">
                                 <div
                                    :title="participant.stats.totalDamageTaken.toLocaleString('en-US')"
                                    :style="{ backgroundColor: '#7b7a8e',
                                    height:'6px',
                                    width: participant.stats.totalDamageTaken/calcTotalDamageTaken(index)*180+'%'}">
                                    </div>
                              </div>
                           </div>
                        </td>
                        <td style="width:40px;">
                           <div class="wardText">
                              {{participant.stats.visionWardsBoughtInGame}}
                              <br>
                              {{participant.stats.wardsPlaced}}/{{participant.stats.wardsKilled}}
                           </div>
                        </td>
                        <td style="width:40px;">
                           <span style="font-size:12px;display: block;">
                           {{participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled}}
                           {{((participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled)/
                           (matchDetails.gameDuration/60)).toFixed(1)}}/m
                           </span>
                        </td>
                        <td style="padding-left:10px;">
                           <img :src="getIcon(participant.stats.item0)"
                           class="thumbround" />
                           <img :src="getIcon(participant.stats.item1)"
                           class="thumbround" />
                           <img :src="getIcon(participant.stats.item2)"
                           class="thumbround" />
                           <img :src="getIcon(participant.stats.item3)"
                           class="thumbround" />
                           <img :src="getIcon(participant.stats.item4)"
                           class="thumbround" />
                           <img :src="getIcon(participant.stats.item5)"
                           class="thumbround" />
                           <img :src="getIcon(participant.stats.item6)"
                           class="thumbround" />
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
import {
  championIds, runeIcons, summonerSpells, CHAMPIONICONURL, ITEMICONURL, RUNEICONURL,
} from '../res/common';

const open = require('open');

export default {
  name: 'DetailedMatchInfo',
  props: {
    matchDetails: {
      // The order of the teams is done in MatchHistoryItem
      type: Object,
    },
  },
  methods: {
    calcTotalDamage(index) {
      let totalDamage = 0;
      for (const player of this.matchDetails.participants) {
        if (player.teamId === this.matchDetails.participants[index].teamId) {
          totalDamage += player.stats.totalDamageDealtToChampions;
        }
      }
      return totalDamage;
    },
    calcTotalGold(index) {
      let totalGold = 0;
      for (const player of this.matchDetails.participants) {
        if (player.teamId === this.matchDetails.participants[index].teamId) {
          totalGold += player.stats.goldEarned;
        }
      }
      return totalGold;
    },
    getIcon(itemId) {
      if (itemId > 0) {
        return `${ITEMICONURL + itemId}.png`;
      }
      return '/assets/0.png';
    },
    calcTotalKills(index) {
      let totalKills = 0;
      for (const player of this.matchDetails.participants) {
        if (player.teamId === this.matchDetails.participants[index].teamId) {
          totalKills += player.stats.kills;
        }
      }
      return totalKills;
    },
    calcTotalDamageTaken(index) {
      let totalKills = 0;
      for (const player of this.matchDetails.participants) {
        if (player.teamId === this.matchDetails.participants[index].teamId) {
          totalKills += player.stats.totalDamageTaken;
        }
      }
      return totalKills;
    },
    formatLevelBulb(levelD) {
      const level = String(levelD);
      return (level.length < 2) ? `0${level}` : level;
    },
    openLink(url) {
      open(url);
    },
    getTeamId(index) {
      if (this.matchDetails.participants[index].teamId === 100) {
        return 0;
      }
      return 1;
    },
    getKDAStyle(kda) {
      if (kda >= 5) { return '#ff8200'; }
      if (kda >= 4) { return '#0093ff'; }
      if (kda >= 3) { return '#00bba3'; }
      return '#9a96a4';
    },
    searchPlayer(username) {
      this.$router.push({
        name: 'Home',
        params: {
          summonerSearch: username,
        },
      });
    },
  },
  data() {
    return {
      CHAMPIONICONURL,
      ITEMICONURL,
      RUNEICONURL,
      championIds,
      runeIcons,
      summonerSpells,
    };
  },
};

</script>
<style scoped>
.totalKillsLabel {
   font-size:10px;
   line-height: 120%;
   margin:0 auto;
   position:absolute;
   padding-left:70px;
   margin-top:2px;
}
.championLeveLBulb {
   position:absolute;
   left:4px;
   font-size:12px;
   background-color:#080808;
   border-radius:50%;
   margin-top:30px;
   padding:1px;
}
.header-bar {
   display:flex;
   margin:auto;
   background-color:#31313c;
   font-family: Roboto, sans-serif;
   font-size:11px;
   height:16px;
   padding-top:4px;
}
.middle-wrapper {
   padding-top:4px;
   padding-bottom:4px;
   width:100%;
   font-size:12px;
   background-color:#282830;
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
.accentRed {
   background-color:#e84057;
}
.accentBlue {
   background-color:#5383e8;
}
.thumbround {
   padding-left:1px;
  border-radius:4px;
}
.summonername {
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}
td{
  vertical-align:middle;
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
