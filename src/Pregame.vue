<template>
    <div class="wrapper2">
        <div class="team">
            <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
                <div v-if="teammate.teamId == undefined || teammate.teamId == 1" class="miniCard">
                    <img :src='`assets/Emblem_${teammate.queueMap.RANKED_SOLO_5x5.tier}.webp`' style="height:70px;">
                    <br>
                    <span @click="searchSummoner(teammate.username)">{{teammate.username}}</span>
                    <br>
                    <span style="font-size:12px;">{{capitalize(teammate.queueMap.RANKED_SOLO_5x5.tier)}}
                        {{romanNumbers[teammate.queueMap.RANKED_SOLO_5x5.division]}}
                        ({{teammate.queueMap.RANKED_SOLO_5x5.leaguePoints}}LP)</span>
                    <br>
                    <div v-for="(match,index) in teammate.matchHistory.games.games" :key="match.gameId"
                        :class='`matchItem`'>
                        <div v-if="!(teammate.teamId == 1 && index > 4)">
                            <img @click="openLink(
                              'https://na.op.gg/champions/'+championIds[match.participants[0].championId]
                              )"
                                :src="CHAMPIONICONURL+match.participants[0].championId+'.png'"
                                style="border-radius:10px;width:20px;height:20px;">
                            <div :class='`kda ${match.participants[0].stats.win ? "Victory" : "Defeat"}`'>
                                <span style="white-space:nowrap">
                                  {{match.participants[0].stats.kills + "/"
                                  + match.participants[0].stats.deaths + "/"
                                  + match.participants[0].stats.assists}}
                                </span>
                            </div>
                            <span class="sinceGame">{{sinceGame(Date.now()-match.gameCreation)}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="team">
            <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
                <div v-if="teammate.teamId == 2" class="miniCard">
                    <img :src='`assets/Emblem_${teammate.queueMap.RANKED_SOLO_5x5.tier}.webp`' style="height:70px;">
                    <br>
                    <span @click="searchSummoner(teammate.username)">{{teammate.username}}</span>
                    <br>
                    <span style="font-size:12px;">{{capitalize(teammate.queueMap.RANKED_SOLO_5x5.tier)}}
                        {{romanNumbers[teammate.queueMap.RANKED_SOLO_5x5.division]}}
                        ({{teammate.queueMap.RANKED_SOLO_5x5.leaguePoints}}LP)</span>
                    <br>
                    <div v-for="(match,index) in teammate.matchHistory.games.games" :key="match.gameId"
                        :class='`matchItem`'>
                        <div v-if="index < 5">
                            <a :href="'https://na.op.gg/champions/'+championIds[match.participants[0].championId]">
                                <img :src="CHAMPIONICONURL+match.participants[0].championId+'.png'"
                                    style="border-radius:10px;width:20px;height:20px;">
                            </a>
                            <div :class='`kda ${match.participants[0].stats.win ? "Victory" : "Defeat"}`'>
                                <span style="white-space:nowrap">
                                  {{match.participants[0].stats.kills + "/"
                                  + match.participants[0].stats.deaths + "/"
                                  + match.participants[0].stats.assists}}
                                </span>
                            </div>
                            <span class="sinceGame">{{sinceGame(Date.now()-match.gameCreation)}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import { championIds, romanNumbers, CHAMPIONICONURL } from './res/common';

const { ipcRenderer } = require('electron');
const open = require('open');

export default {
  name: 'PregameLobby',
  data() {
    return {
      CHAMPIONICONURL,
      championIds,
      polling: null,
      ondata: null,
      romanNumbers,
      lobbyPlayers: [],
      filledGameId: 0,
      currentGame: {},
    };
  },
  watch: {
    $route() {
      // Unregister the listener..
      console.log('Unregistering Listeners on Pregame');
      ipcRenderer.removeListener('asynchronous-reply', this.ondata);
      clearInterval(this.polling);
    },
  },
  methods: {
    changeRoute(route) {
      // Unregister the listener..
      ipcRenderer.removeListener('asynchronous-reply', this.ondata);
      clearInterval(this.polling);
      this.$router.push(route);
    },
    getSummonerById(id, teamId) {
      ipcRenderer.send('asynchronous-message', {
        id: 'lol-lobby-playercard',
        summonerId: id,
        teamId,
      });
    },
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
    openLink(url) {
      open(url);
    },
  },
  created() {
    this.ondata = (event, data) => {
      // Dug
      console.log('DEBUG: Async Reply: ', data);

      // All replies should have a reply_type set.
      if (data.reply_type === undefined) {
        console.log('ERROR UNSET REPLY_TYPE in DATA');
        return;
      }

      // We have diconnected or auth error..
      if (data.reply_type === 'lcu-disonnceted') {
        console.log('Disconnected..');
      }

      // Valid reply handlers
      switch (data.reply_type) {
        case 'lol-champ-select': {
          this.lobbyData = data;
          if (!this.lobbyPlayers.length) {
            for (const player of this.lobbyData.myTeam) {
              this.getSummonerById(player.summonerId);
            }
          }
          break;
        }
        case 'current-session': {
          if (data.phase === 'InProgress' && (this.filledGameId !== data.gameData.gameId)) {
            this.lobbyData = data;
            this.filledGameId = data.gameData.gameId;
            this.lobbyPlayers = [];

            for (const player of data.gameData.teamOne) {
              this.getSummonerById(player.summonerId, 1);
            }
            for (const player of data.gameData.teamTwo) {
              this.getSummonerById(player.summonerId, 2);
            }
          }
          break;
        }
        case 'lol-lobby-playercard': {
          this.lobbyPlayers.push(data);
          break;
        }
        default: {
          console.error('Handling for', data.reply_type, 'is not implemented');
          break;
        }
      }
    };
    ipcRenderer.on('asynchronous-reply', this.ondata);

    // We are already in a champ select because we got navigated here..
    // just get the data again instead of being passed into this view..
    ipcRenderer.send('asynchronous-message', {
      id: 'lol-champ-select',
    });
    ipcRenderer.send('asynchronous-message', {
      id: 'current-session',
    });

    this.polling = setInterval(() => {
      ipcRenderer.send('asynchronous-message', {
        id: 'lol-champ-select',
      });
      ipcRenderer.send('asynchronous-message', {
        id: 'current-session',
      });
    }, 15000);
  },
};
</script>

<style scoped>
.kda {
    margin-left:10px;
    padding:0 10px 0px 10px;
    font-size:15px;
    color:#080808;
    text-align:center !important;
    display:inline-block;
    width:50px;
    border-radius:4px;
    font-weight: 400;
}
.Victory {
    color:#5cd7e4;
    background-color:rgba(92, 215, 228, 0.5)
}
.Defeat {
    color:#ba4b45;
    background-color:rgb(186, 75, 69, 0.5);
}
.sinceGame {
  font-size:15px;
  margin-left:4px;
  background-color:#5d4e73;
  border-radius:4px;
  padding-left:4px;
  padding-right:4px;
}
.matchItem {
    margin:auto;
    width:150px;
    text-align:left;
}
.team {
    display: flex;
    max-width: 1130px;
}
.miniCard {
    margin: 10px;
    padding:10px;
    color: #9a96a4;
    border-radius: 5px;
    background-color: #020202;
    filter: drop-shadow(0 0 0.1rem #5cd7e4);
}
.wrapper2 {
    margin:auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
