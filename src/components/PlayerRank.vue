

<template>
  <div id="playerCard" v-if="data?.queueMap?.RANKED_SOLO_5x5" >
    <span style="float:left;padding-left:8px;">Solo/Duo</span>
    <table style="width:100%;">
      <td>
        <img :src='`assets/Emblem_${data.queueMap.RANKED_SOLO_5x5.tier}.webp`' class="backgroundImg" style="height:60px;">
      </td>
      <td style="vertical-align:middle; text-align:left;">
        <span style="color:#f2ecff;"><b>{{capitalize(data.queueMap.RANKED_SOLO_5x5.tier)}} {{romanNumbers[data.queueMap.RANKED_SOLO_5x5.division]}}</b></span>
        <br>
        <span>{{data.queueMap.RANKED_SOLO_5x5.leaguePoints}}LP </span>
        </td>
      <td style="text-align:right;vertical-align:middle;">
        <span>{{data.queueMap.RANKED_SOLO_5x5.wins}}W {{data.queueMap.RANKED_SOLO_5x5.losses}}L</span>
        <br>
        <span>Win Rate {{Math.round(data.queueMap.RANKED_SOLO_5x5.wins/(data.queueMap.RANKED_SOLO_5x5.wins+data.queueMap.RANKED_SOLO_5x5.losses)*100)}}%</span>
      </td>
    </table>
  </div>
</template> 

<script>

import { romanNumbers } from '../res/common.js'

export default {
  name: 'PlayerRank',
  props: {
    data: {
        type: Object
      }
  },
  data(){
    return {
      romanNumbers: romanNumbers
    }
  },
  methods: {
    capitalize(s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
    }
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#playerCard {
  vertical-align:top;
  padding:10px;
  color: #f2ecff;
  background-color:#080808;
  border-radius:5px;
}
td{
  font-size:15px;
  color: #555872;
  margin-top:40px;
}
.backgroundImg img{
  filter: drop-shadow(0 0 0.7rem black);
}
.backgroundImg{
  padding-top:1px;
  border-color:#080808;
  background-color: rgba(10, 10, 10, 0.8);
  border-radius: 40px;
}
</style>
