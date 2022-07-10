<template>
  <div id="playerCard" v-if="data != null" >
    <div v-for="(champion,index) in data" :key=index>
        <div style="
        border-radius:4px;
        background-color:#161818;display:inline-block;width:220px;padding:10px;margin-bottom:4px;">
        <img
        :src="CHAMPIONICONURL+champion.id+'.png'"
        style="height:25px;border-radius:50%;float:left;">
        <div style="float:left;">
        {{championIds[champion.id]}}
        <br>
        <!-- KDA -->
        {{(((champion.kills+champion.assists)/champion.deaths)).toFixed(2)}}:1 KDA
        </div>
        <div style="float:right;">
          {{(champion.wins/(champion.wins+champion.losses)*100).toFixed(0)}}%
          <br>
          {{(champion.wins+champion.losses)}} Played
        </div>

      </div>
        <br>
    </div>
  </div>
</template>

<script>
import {
  CHAMPIONICONURL,
  championIds,
} from '../res/common';

export default {
  name: 'RankedChampionOverview',
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      championIds,
      CHAMPIONICONURL,
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#playerCard {
  vertical-align:top;
  padding:10px;
  color: #f2ecff;
  background-color:#080808;
  font-size:10px;
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
