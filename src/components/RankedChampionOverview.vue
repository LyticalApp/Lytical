<template>
  <Transition>
    <div id="playerCard" v-show="this.visibility">
        <div v-for="(champion,index) in data" :key=index>
          <div style="display:inline-block;width:275px;margin-bottom:12px;">
              <img
                @click="openLink(
                    'https://na.op.gg/champions/'+championIds[champion.id]
                  )"
                :src="CHAMPIONICONURL+champion.id+'.png'"
                style="height:32px;border-radius:50%;float:left;margin-right:10px;"/>
              <!-- KDA -->
              <div>
              <div style="display:inline-block;text-align:left;float:left;">
                <b><div                @click="openLink(
                    'https://na.op.gg/champions/'+championIds[champion.id]
                  )" class="largeText">{{championIds[champion.id]}}</div></b>
                CS {{(champion.cs/champion.total).toFixed(1)}} ({{(champion.cs/(champion.time/60)).toFixed(1)}})
              </div>
              <div style="display:inline-block;">
                <div :style="{ color: getKDAStyle(((champion.kills+champion.assists)/champion.deaths))}">
                    <b class="largeText">{{(((champion.kills+champion.assists)/champion.deaths)).toFixed(2)}}:1 KDA</b>
                    <br>
                    {{(((champion.kills)/champion.total)).toFixed(1)}} /
                    {{(((champion.deaths)/champion.total)).toFixed(1)}} /
                    {{(((champion.assists)/champion.total)).toFixed(1)}}
                </div>
              </div>
                <div style="display:inline-block;text-align:right;float:right;">
                  <span class="largeText" :style="{ color: getWinrateStyle(champion.wins/(champion.total)*100)}">
                  {{(champion.wins/(champion.total)*100).toFixed(0)}}%
                  </span>
                  <br>
                  {{(champion.total)}} Played
                </div>
              </div>
          </div>
          <br>
          {{toggleVisibility(index)}}
        </div>
    </div>
  </Transition>
</template>

<script>
import {
  CHAMPIONICONURL,
  championIds,
} from '../res/common';

const open = require('open');

export default {
  name: 'RankedChampionOverview',
  props: {
    data: {
      type: Object,
    },
  },
  watch: {
    data() {
      this.visibility = false;
    },
  },
  data() {
    return {
      championIds,
      CHAMPIONICONURL,
      visibility: false,
    };
  },
  methods: {
    capitalize(s) {
      if (typeof s !== 'string') { return ''; }
      return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();
    },
    getKDAStyle(kda) {
      if (kda >= 5) { return '#ff8200'; }
      if (kda >= 4) { return '#0093ff'; }
      if (kda >= 3) { return '#00bba3'; }
      return '#9a96a4';
    },
    getWinrateStyle(wr) {
      if (wr >= 60) { return '#e84057'; }
      return '#9e9eb1';
    },
    openLink(url) {
      open(url);
    },
    toggleVisibility(index) {
      // We actually interate the loop 2 times because of the updated visibility..
      // but it do work though!
      if (index === 6 && !this.visibility) {
        this.visibility = true;
      }
    },
  },
};
</script>

<style scoped>
#playerCard {
  vertical-align:top;
  padding:10px;
  color: #9a96a4;
  font-size:10px;
  border-radius:5px;
}
.largeText {
  weight: bold;
  font-size: 13px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
