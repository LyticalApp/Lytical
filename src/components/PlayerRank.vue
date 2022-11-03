<template>
  <div id="playerCard" v-if="data?.queueMap?.RANKED_SOLO_5x5" >
    <span style="float:left;padding-left:8px;">Solo/Duo
    </span>
    <table style="width:100%;    padding-top: 10px;">
      <td>
        <img
        :src='`assets/ranks/${data.queueMap.RANKED_SOLO_5x5.tier}.webp`'
        class="backgroundImg" style="height:60px;"
        />
      </td>
      <td style="vertical-align:middle; text-align:left;">
        <span style="color:#f2ecff;"><b>
          {{capitalize(data.queueMap.RANKED_SOLO_5x5.tier)}}
           {{romanNumbers[data.queueMap.RANKED_SOLO_5x5.division]}}
          </b></span>
        <br>
        <span>{{data.queueMap.RANKED_SOLO_5x5.leaguePoints}}LP </span>
        </td>
      <td style="text-align:right;vertical-align:middle;">
        <span>
          {{data.queueMap.RANKED_SOLO_5x5.wins}}W {{data.queueMap.RANKED_SOLO_5x5.losses}}L
          <i v-if="data.flag"
          title="Info: Only includes latest 200 games" style="color:#797979d9;font-size:15px;"
      class="icon-question-circle" aria-hidden="true"></i>
        </span>
        <br>
        <span>
          Win Rate
           {{Math.round(data.queueMap.RANKED_SOLO_5x5.wins/
          (data.queueMap.RANKED_SOLO_5x5.wins+data.queueMap.RANKED_SOLO_5x5.losses)*100)
          }}%</span>
      </td>
    </table>
  </div>
</template>

<script>

import { romanNumbers } from '../res/common';

export default {
  name: 'PlayerRank',
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      romanNumbers,
    };
  },
  methods: {
    capitalize(s) {
      if (typeof s !== 'string') { return ''; }
      return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();
    },
  },
};
</script>

<style scoped>
#playerCard {
  vertical-align:top;
  padding:10px;
  color: #f2ecff;
  border-radius:5px;
  margin-bottom:10px;
}
td{
  font-size:15px;
  color: #9a96a4;
  margin-top:40px;
}
.backgroundImg img{
  filter: drop-shadow(0 0 0.7rem black);
}
.backgroundImg{
  padding-top:1px;
  border-color:#080808;
  background-color: #16181854;
  border-radius: 40px;
}
</style>
