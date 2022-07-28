<template>
  <div id="playerCard" v-if="data?.queueMap?.RANKED_SOLO_5x5" >
    <table>
      <td>
        <img
        :src='`${PROFILEPICONURL + data.summonerData.profileIconId}.jpg`'
        class="clip-circle" style="height:80px;margin-right:10px;max-width:280px;">
      </td>
      <td style="vertical-align:middle; align:left;">
        <span class="usernameText">{{data.username}}</span>
        <br>
        <span style="font-size:14px;">Level {{data.summonerData.summonerLevel}}</span>
        <br>
        <br>
        <span style="background-color:#161818;font-size:10px;padding:3px;">
          S{{getPreviousSeason()}} {{data.highestPreviousSeasonEndTier}}
           {{data.highestPreviousSeasonEndDivision}}
          </span>
      </td>
    </table>
  </div>
</template>

<script>
import { PROFILEPICONURL } from '../res/common';

export default {
  name: 'PlayerCard',
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      PROFILEPICONURL,
    };
  },
  methods: {
    getPreviousSeason() {
      let d = new Date();
      d = d.getFullYear() - 1;
      return d.toString().substr(2, 2);
    },
  },
};
</script>

<style scoped>
#playerCard {
  margin:0 auto;
  text-align: left;
  vertical-align:top;
  padding:10px;
  color: #f2ecff;
  background-color:#080808;
  border-radius:5px;
  margin-bottom: 10px;
}
.usernameText {
  display: inherit;
  overflow: hidden;
  max-width: 190px;
  text-overflow: ellipsis;
  font-size: 20px;
}
span {
  margin-bottom: 4px;
  float:left;
}
.clip-circle {
  clip-path: circle(40px at center);
}
</style>
