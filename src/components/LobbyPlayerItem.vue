<template>
    <div class="miniCard">
        <img v-if="teammate.championId" class="selectedChampion emblem"
            :src="CHAMPIONICONURL + teammate.championId + '.png'">
        <img class="emblem" :src='`assets/Emblem_${teammate.queueMap.RANKED_SOLO_5x5.tier}.webp`'>
        <br>
        <span @click="searchSummoner(teammate.username)">{{ teammate.username }}</span>
        <br>
        <span style="font-size:12px;">{{ capitalize(teammate.queueMap.RANKED_SOLO_5x5.tier) }}
            {{ romanNumbers[teammate.queueMap.RANKED_SOLO_5x5.division] }}
            ({{ teammate.queueMap.RANKED_SOLO_5x5.leaguePoints }}LP)</span>
        <br>
        <span style="font-size:12px;">{{ capitalize(teammate.position) }}</span>
        <br>
        <div v-for="(match, index) in teammate.matchHistory.games.games" :key="match.gameId" class="matchItem">
            <div v-if="index < 5">
                <img @click="open(getPreferredSite(match.participants[0].championId))"
                    :src="CHAMPIONICONURL + match.participants[0].championId + '.png'" class="championIcon">
                <div :class='`kda ${match.participants[0].stats.win ? "Victory" : "Defeat"}`'>
                    <span style="white-space:nowrap">
                        {{ match.participants[0].stats.kills + "/"
                                + match.participants[0].stats.deaths + "/"
                                + match.participants[0].stats.assists
                        }}
                    </span>
                </div>
                <span class="sinceGame">{{ sinceGame(Date.now() - match.gameCreation) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {
  getPreferredSite,
  romanNumbers,
  CHAMPIONICONURL,
} from '../res/common';

const open = require('open');

export default {
  name: 'LobbyPlayerItem',
  props: {
    teammate: Object,
  },
  data() {
    return {
      romanNumbers,
      CHAMPIONICONURL,
    };
  },
  methods: {
    open,
    getPreferredSite,
    capitalize(s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();
    },
    sinceGame(secondsN) {
      const seconds = Number(secondsN / 1000);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor((seconds % (3600 * 24)) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      if (d > 0) return (`${d}d`);
      if (h > 0) return (`${h}h`);
      return (`${m}m`);
    },
    searchSummoner(summoner) {
      this.$router.push({
        name: 'Home',
        params: {
          summonerSearch: summoner,
        },
      });
    },
  },
};
</script>

<style scoped>
.championIcon {
  border-radius: 10px;
  width: 20px;
  height: 20px;
}

.kda {
  margin-left: 10px;
  padding: 0 10px 0px 10px;
  font-size: 15px;
  color: var(--dark-grey);
  text-align: center !important;
  display: inline-block;
  width: 55px;
  border-radius: 4px;
  font-weight: 400;
}

.emblem {
  height: 70px;
}

.selectedChampion {
  border-radius: 50%;
}

.Victory {
  color: var(--lobby-victory-text);
  background-color: var(--lobby-victory-background);
}

.Defeat {
  color: var(--lobby-defeat-text);
  background-color: var(--lobby-defeat-background);
}

.sinceGame {
  font-size: 15px;
  margin-left: 4px;
  width: 28px;
  display: inline-block;
  background-color: var(--minicard-since-background);
  border-radius: 4px;
  padding-left: 4px;
  padding-right: 4px;
  text-align: center;
}

.matchItem {
  margin: auto;
  width: 150px;
  text-align: left;
}

.team {
  display: flex;
  max-width: 1130px;
}

.miniCard {
  min-height: 260px;
  margin: 10px;
  padding: 10px;
  color: var(--minicard-text);
  border-radius: 5px;
  background-color: var(--minicard-background);
  filter: drop-shadow(0 0 0.1rem #5cd7e4);
}
</style>
