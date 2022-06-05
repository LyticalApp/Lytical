<template>
  <div id="playerCard" v-if="data?.queueMap?.RANKED_SOLO_5x5" >
    <table>
    <td>
      <img :src='`assets/Emblem_${data.queueMap.RANKED_SOLO_5x5.tier}.png`' style="height:60px;">
    </td>
    <td style="vertical-align:top; align:left;">
    <span>Ranked Solo</span>
    <br>
    <span>{{data.username}}</span>
    <br>
    <span>{{data.queueMap.RANKED_SOLO_5x5.tier}}  {{data.queueMap.RANKED_SOLO_5x5.division}}</span>
    <br>
    <span>{{data.queueMap.RANKED_SOLO_5x5.leaguePoints}}LP / {{data.queueMap.RANKED_SOLO_5x5.wins}}W {{data.queueMap.RANKED_SOLO_5x5.losses}}L</span>    
    </td>
    </table>
  </div>
</template> 

<script>
export default {
  name: 'PlayerCard',
  
  props: {
    data: {
        type: Object
      }
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#playerCard {
  vertical-align:top;
  padding:10px;
  background-color:white;
  border-radius:5px;
}
span {
  float:left;
}
</style>
