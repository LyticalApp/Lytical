<template>
  <div :class='`matchItem ${matchResult()}`' @click="getGameDetails">
    <table>
      <tbody>
        <tr>
          <td style="width:85px;text-align:left;">
            <div>
              <!-- Gamemode and Preview -->
              <span style="font-size:14px;"><b>{{queueIds[data.queueId]}}</b></span>
              <span style="font-size:10px;">{{sinceGame(Date.now()-data.gameCreation)}}</span>
              <div style="width:40px;border-top: 1px solid #5a4656;margin-top:4px;margin-bottom:4px;">
              </div>
              <span style="font-size:12px;font-weight:bold;">{{matchResult()}}</span>
              <span style="font-size:12px;">{{gameLengthHR(data.gameDuration)}}</span>
            </div>
          </td>
          <td>
            <div>
              <!-- Icon summoners, and champ name -->
              <div>
                <!-- 2x2 -->
                <table style="display:inline;">
                  <td style="padding:0px;vertical-align:bottom;">
                    <span class="championLevelBulb">
                      {{formatLevelBulb(data.participants[0].stats.champLevel)}}
                    </span>
                    <img @click.stop="open(getPreferredSite(data.participants[0].championId))"
                      :src="CHAMPIONICONURL+data.participants[0].championId+'.png'"
                      style="width:50px;height:50px;border-radius:50%;">
                  </td>
                  <td style="padding:0px;">
                    <!-- Summoner Spells -->
                    <img
                      :src='`assets/spells/${summonerSpells[data.participants[0].spell1Id]}.webp`'
                      class='thumbicon thumbround'>
                    <br>
                    <img
                      :src='`assets/spells/${summonerSpells[data.participants[0].spell2Id]}.webp`'
                      class='thumbicon thumbround'>
                  </td>
                  <td style="padding:0px;">
                    <!-- Runes -->
                    <img :src="RUNEICONURL+runeIcons[data.participants[0].stats.perk0]"
                      class='thumbicon thumbround'>
                    <br>
                    <img :src="RUNEICONURL+runeIcons[data.participants[0].stats.perkSubStyle]"
                      class='thumbicon thumbround'>
                  </td>
                </table>
              </div>
            </div>
          </td>
          <td style="width:90px;">
            <!-- K/D/A -->
            <div>
              <span
                style="font-weight:bold;display:inline-block;color:#fff;">
                {{data.participants[0].stats.kills}}
              </span>
              /
              <span
                style="font-weight:bold;display:inline-block;color:#e84057;">
                {{data.participants[0].stats.deaths}}
              </span>
              /
              <span
                style="font-weight:bold;display:inline-block;color:#fff;">
                {{data.participants[0].stats.assists}}
              </span>
            </div>
            <span
              style="font-size:12px;">
              {{((data.participants[0].stats.kills+data.participants[0].stats.assists)
              /data.participants[0].stats.deaths).toFixed(2)}}:1
              KDA
            </span>
          </td>
          <td style="text-align:left;font-size:11px;width:80px;">
            <!-- Personal Stats -->
            <span style="color:#e84057;">
              {{(data.participants[0].stats.totalDamageDealtToChampions/1000).toFixed(1)}}k Damage
            </span>
            <span>Control Ward {{data.participants[0].stats.visionWardsBoughtInGame}}</span>
            <span>{{totalCS()}} ({{(totalCS()/(data.gameDuration/60)).toFixed(1)}}) CS</span>
            <span style="font-size:8px;font-weight:bold;">
              {{championIds[data.participants[0].championId]}}
            </span>
            <!-- <span>P/Kill 10%</span> -->
          </td>
          <td>
            <!-- Items -->
            <table>
              <td style="padding:0px;">
                <img :src="getIcon(data.participants[0].stats.item0)" class='thumbicon thumbround'>
              </td>
              <td style="padding:0px;">
                <img :src="getIcon(data.participants[0].stats.item1)" class='thumbicon thumbround'>
              </td>
              <td style="padding:0px;">
                <img :src="getIcon(data.participants[0].stats.item2)" class='thumbicon thumbround'>
              </td>
              <td style="padding:0px;">
                <img :src="getIcon(data.participants[0].stats.item3)" class='thumbicon thumbround'>
              </td>
              <tr>
                <td style="padding:0px;">
                  <img :src="getIcon(data.participants[0].stats.item4)" class='thumbicon thumbround'>
                </td>
                <td style="padding:0px;">
                  <img :src="getIcon(data.participants[0].stats.item5)" class='thumbicon thumbround'>
                </td>
                <td style="padding:0px;">
                  <img :src="getIcon(data.participants[0].stats.item6)" class='thumbicon thumbround'>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <div :class="`showDetailsTip ${showDetails ? 'flip180' : ''}`">
      <i class="icon-keyboard_arrow_down"></i>
    </div>
    <!-- Begin Detailed Match History Item -->
    <DetailedMatchInfo
      :matchDetails=matchDetails
      :profileSummoner=profileSummoner
      v-show="showDetails"
    />
  </div>
</template>

<script>
import {
  runeIcons, summonerSpells, CHAMPIONICONURL, ITEMICONURL, RUNEICONURL, queueIds, championIds, getPreferredSite,
} from '../res/common';
import DetailedMatchInfo from './MatchDetailsItem.vue';

const { ipcRenderer } = require('electron');
const open = require('open');

export default {
  name: 'MatchHistoryItem',
  components: {
    DetailedMatchInfo,
  },
  props: {
    data: {
      type: Object,
    },
    profileSummoner: {
      type: String,
    },
  },
  methods: {
    getPreferredSite,
    open,
    getGameDetails() {
      if (this.matchDetails == null) {
        ipcRenderer.send('asynchronous-message', { id: 'lol-match-details', gameId: this.data.gameId });
        // Add the Listener for the reply which will be destroyed
        this.matchListener = (event, data) => {
          if (data.reply_type === 'lol-match-details') {
            if (data.gameId === this.data.gameId) {
              this.matchDetails = data;
              // format team order based on whos profile we're on. They should always in the first half of the list.
              const team0 = [
                this.matchDetails.participantIdentities[0].player.summonerName,
                this.matchDetails.participantIdentities[1].player.summonerName,
                this.matchDetails.participantIdentities[2].player.summonerName,
                this.matchDetails.participantIdentities[3].player.summonerName,
                this.matchDetails.participantIdentities[4].player.summonerName,
              ];
              if (!team0.includes(this.profileSummoner)) {
                this.matchDetails.participantIdentities = this.matchDetails.participantIdentities.reverse();
                this.matchDetails.participants = this.matchDetails.participants.reverse();
              }
              ipcRenderer.removeListener('asynchronous-reply', this.matchListener);
            }
          }
        };
      }
      ipcRenderer.on('asynchronous-reply', this.matchListener);
      this.showDetails = !this.showDetails;
    },
    getIcon(itemId) {
      if (itemId > 0) {
        return `${ITEMICONURL + itemId}.png`;
      }
      return '/assets/0.png';
    },
    totalCS() {
      return (this.data.participants[0].stats.totalMinionsKilled
      + this.data.participants[0].stats.neutralMinionsKilled);
    },
    matchResult() {
      const SIX_MINUTES = 6 * 60;
      if (this.data.gameDuration < SIX_MINUTES) {
        return 'Remake';
      }
      return this.data.participants[0].stats.win ? 'Victory' : 'Defeat';
    },
    gameLengthHR(lengthInSeconds) {
      const seconds = Number(lengthInSeconds);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor((seconds % (3600 * 24)) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '';
      const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours ') : '';
      const mDisplay = m > 0 ? m + (m === 1 ? 'm' : 'm ') : '';
      const sDisplay = s > 0 ? s + (s === 1 ? 's' : 's') : '';
      return dDisplay + hDisplay + mDisplay + sDisplay;
    },
    sinceGame(sinceSeconds) {
      const seconds = Number(sinceSeconds / 1000);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor((seconds % (3600 * 24)) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const dDisplay = d > 0 ? d + (d === 1 ? ' day ' : ' days ') : '';
      const hDisplay = (h > 0 && !dDisplay) ? h + (h === 1 ? ' hour ' : ' hours ') : '';
      const mDisplay = (m > 0 && !hDisplay && !dDisplay) ? m + (m === 1 ? ' minute ' : ' minutes ') : '';
      return `${dDisplay + hDisplay + mDisplay} ago`;
    },
    formatLevelBulb(level) {
      const strLevel = String(level);
      return (strLevel.length < 2) ? `0${strLevel}` : strLevel;
    },
  },
  data() {
    return {
      showDetails: false,
      matchListener: null,
      matchDetails: null,
      queueIds,
      championIds,
      CHAMPIONICONURL,
      RUNEICONURL,
      ITEMICONURL,
      runeIcons,
      summonerSpells,
    };
  },
};
</script>

<style scoped>

.thumbround {
  border-radius:4px;
}
td {
  padding: 8px 10px 8px 10px;
}
span {
  display:block;
}
.championLevelBulb {
  position:absolute;
  left:115px;
  font-size:14px;
  background-color:var(--minicard-background);
  border-radius:50%;
  margin-top:35px;
  padding:2px;
}
.matchItem {
  background-color:var(--minicard-background);
  color: #9a96a4;
  cursor: pointer;
  border-radius: 5px;
  min-width:579px;
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
  width:22px;
  height:22px;
}
.Victory {
  filter: drop-shadow(0 0 0.1rem #5cd7e4);
}
.Defeat {
  filter: drop-shadow(0 0 0.1rem #ba4b45);
}
.Remake {
  filter: drop-shadow(0 0 0.1rem #6b6b6b);
}
.Victory b{
  font-weight: normal;
  color: #5cd7e4;
}
.Defeat b{
  font-weight: normal;
  color: #ba4b45;
}
.Remake b{
  font-weight: normal;
  color: #6b6b6b;
}
.showDetailsTip {
    position: absolute;
    z-index: 0;
    width: fit-content;
    right: 15px;
    top: 64px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size:18px;
    text-align:center;
}
.flip180 {
  transform: rotate(180deg);
}
</style>
