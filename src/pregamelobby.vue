<template>
    <button @click="changeRoute('/')">Home</button>
    <h1>Wow we are in the pregame lobby!</h1>
    <div v-for="teammate in lobbyPlayers" :key="teammate.displayName">
    <div id="playerCard">
      <table>
      <td>
        <img :src='`assets/Emblem_BRONZE.png`' style="height:60px;">
      </td>
      <td style="vertical-align:top; align:left;">
      <span>Ranked Solo</span>
      <br>
      <span>{{teammate.displayName}}</span>
      <br>
      <span>{{teammate.displayName}}  {{teammate.displayName}}</span>
      <br>
      <span>{{teammate.displayName}}LP / {{teammate.displayName}}W {{teammate.displayName}}L</span>
      </td>
      </table>
    </div>
  </div>
</template>

<script>

const { ipcRenderer } = require('electron')

export default {
  name: 'PregameLobby',
  data(){
    return{
      polling: null,
      ondata: null,
      lobbyPlayers: [
    {
        "accountId": 2186940260526176,
        "displayName": "Riplboss",
        "internalName": "Riplboss",
        "nameChangeFlag": false,
        "percentCompleteForNextLevel": 98,
        "privacy": "PUBLIC",
        "profileIconId": 4904,
        "puuid": "dad87658-9196-5c79-a382-a86d0244ccde",
        "rerollPoints": {
            "currentPoints": 0,
            "maxRolls": 2,
            "numberOfRolls": 0,
            "pointsCostToRoll": 250,
            "pointsToReroll": 250
        },
        "summonerId": 105070055,
        "summonerLevel": 259,
        "unnamed": false,
        "xpSinceLastLevel": 3041,
        "xpUntilNextLevel": 3072,
        "reply_type": "lol-lobby-playercard"
    },
    {
        "accountId": 210073631,
        "displayName": "ElQuatroQuatro",
        "internalName": "ElQuatroQuatro",
        "nameChangeFlag": false,
        "percentCompleteForNextLevel": 25,
        "privacy": "PUBLIC",
        "profileIconId": 5236,
        "puuid": "96d717ac-51ef-5770-b2ee-af4dcb8bb251",
        "rerollPoints": {
            "currentPoints": 0,
            "maxRolls": 2,
            "numberOfRolls": 0,
            "pointsCostToRoll": 250,
            "pointsToReroll": 250
        },
        "summonerId": 47138975,
        "summonerLevel": 323,
        "unnamed": false,
        "xpSinceLastLevel": 914,
        "xpUntilNextLevel": 3648,
        "reply_type": "lol-lobby-playercard"
    },
    {
        "accountId": 39008507,
        "displayName": "Cropster",
        "internalName": "Cropster",
        "nameChangeFlag": false,
        "percentCompleteForNextLevel": 31,
        "privacy": "PUBLIC",
        "profileIconId": 4569,
        "puuid": "928261f2-cd7a-5ef8-833c-c9c2b0312af6",
        "rerollPoints": {
            "currentPoints": 0,
            "maxRolls": 2,
            "numberOfRolls": 0,
            "pointsCostToRoll": 250,
            "pointsToReroll": 250
        },
        "summonerId": 24629707,
        "summonerLevel": 188,
        "unnamed": false,
        "xpSinceLastLevel": 1027,
        "xpUntilNextLevel": 3264,
        "reply_type": "lol-lobby-playercard"
    },
    {
        "accountId": 210110964,
        "displayName": "9avatarroku9",
        "internalName": "9avatarroku9",
        "nameChangeFlag": false,
        "percentCompleteForNextLevel": 26,
        "privacy": "PUBLIC",
        "profileIconId": 5083,
        "puuid": "6bce4b71-b47a-5671-8aef-2e6e1e3697ae",
        "rerollPoints": {
            "currentPoints": 0,
            "maxRolls": 2,
            "numberOfRolls": 0,
            "pointsCostToRoll": 250,
            "pointsToReroll": 250
        },
        "summonerId": 47270120,
        "summonerLevel": 348,
        "unnamed": false,
        "xpSinceLastLevel": 952,
        "xpUntilNextLevel": 3648,
        "reply_type": "lol-lobby-playercard"
    },
    {
        "accountId": 2725646249157792,
        "displayName": "KnowChat",
        "internalName": "KnowChat",
        "nameChangeFlag": false,
        "percentCompleteForNextLevel": 39,
        "privacy": "PUBLIC",
        "profileIconId": 5367,
        "puuid": "d138bad2-8069-5027-995f-85dbcf2d5626",
        "rerollPoints": {
            "currentPoints": 0,
            "maxRolls": 2,
            "numberOfRolls": 0,
            "pointsCostToRoll": 250,
            "pointsToReroll": 250
        },
        "summonerId": 2725646249157792,
        "summonerLevel": 418,
        "unnamed": false,
        "xpSinceLastLevel": 1368,
        "xpUntilNextLevel": 3456,
        "reply_type": "lol-lobby-playercard"
    }
],
      lobbyData: {
    "actions": [
        [
            {
                "actorCellId": 0,
                "championId": 0,
                "completed": false,
                "id": 0,
                "isAllyAction": false,
                "isInProgress": true,
                "type": "ban"
            },
            {
                "actorCellId": 1,
                "championId": 0,
                "completed": false,
                "id": 1,
                "isAllyAction": false,
                "isInProgress": true,
                "type": "ban"
            },
            {
                "actorCellId": 2,
                "championId": 0,
                "completed": false,
                "id": 2,
                "isAllyAction": false,
                "isInProgress": true,
                "type": "ban"
            },
            {
                "actorCellId": 3,
                "championId": 0,
                "completed": false,
                "id": 3,
                "isAllyAction": false,
                "isInProgress": true,
                "type": "ban"
            },
            {
                "actorCellId": 4,
                "championId": 0,
                "completed": false,
                "id": 4,
                "isAllyAction": false,
                "isInProgress": true,
                "type": "ban"
            },
            {
                "actorCellId": 5,
                "championId": 0,
                "completed": false,
                "id": 5,
                "isAllyAction": true,
                "isInProgress": true,
                "type": "ban"
            },
            {
                "actorCellId": 6,
                "championId": 0,
                "completed": false,
                "id": 6,
                "isAllyAction": true,
                "isInProgress": true,
                "type": "ban"
            },
            {
                "actorCellId": 7,
                "championId": 0,
                "completed": false,
                "id": 7,
                "isAllyAction": true,
                "isInProgress": true,
                "type": "ban"
            },
            {
                "actorCellId": 8,
                "championId": 28,
                "completed": true,
                "id": 8,
                "isAllyAction": true,
                "isInProgress": false,
                "type": "ban"
            },
            {
                "actorCellId": 9,
                "championId": 82,
                "completed": true,
                "id": 9,
                "isAllyAction": true,
                "isInProgress": false,
                "type": "ban"
            }
        ],
        [
            {
                "actorCellId": -1,
                "championId": 0,
                "completed": false,
                "id": 100,
                "isAllyAction": false,
                "isInProgress": false,
                "type": "ten_bans_reveal"
            }
        ],
        [
            {
                "actorCellId": 0,
                "championId": 0,
                "completed": false,
                "id": 10,
                "isAllyAction": false,
                "isInProgress": false,
                "type": "pick"
            }
        ],
        [
            {
                "actorCellId": 5,
                "championId": 0,
                "completed": false,
                "id": 11,
                "isAllyAction": true,
                "isInProgress": false,
                "type": "pick"
            },
            {
                "actorCellId": 6,
                "championId": 876,
                "completed": false,
                "id": 12,
                "isAllyAction": true,
                "isInProgress": false,
                "type": "pick"
            }
        ],
        [
            {
                "actorCellId": 1,
                "championId": 0,
                "completed": false,
                "id": 13,
                "isAllyAction": false,
                "isInProgress": false,
                "type": "pick"
            },
            {
                "actorCellId": 2,
                "championId": 0,
                "completed": false,
                "id": 14,
                "isAllyAction": false,
                "isInProgress": false,
                "type": "pick"
            }
        ],
        [
            {
                "actorCellId": 7,
                "championId": 84,
                "completed": false,
                "id": 15,
                "isAllyAction": true,
                "isInProgress": false,
                "type": "pick"
            },
            {
                "actorCellId": 8,
                "championId": 0,
                "completed": false,
                "id": 16,
                "isAllyAction": true,
                "isInProgress": false,
                "type": "pick"
            }
        ],
        [
            {
                "actorCellId": 3,
                "championId": 0,
                "completed": false,
                "id": 17,
                "isAllyAction": false,
                "isInProgress": false,
                "type": "pick"
            },
            {
                "actorCellId": 4,
                "championId": 0,
                "completed": false,
                "id": 18,
                "isAllyAction": false,
                "isInProgress": false,
                "type": "pick"
            }
        ],
        [
            {
                "actorCellId": 9,
                "championId": 0,
                "completed": false,
                "id": 19,
                "isAllyAction": true,
                "isInProgress": false,
                "type": "pick"
            }
        ]
    ],
    "allowBattleBoost": false,
    "allowDuplicatePicks": false,
    "allowLockedEvents": false,
    "allowRerolling": false,
    "allowSkinSelection": true,
    "bans": {
        "myTeamBans": [],
        "numBans": 0,
        "theirTeamBans": []
    },
    "benchChampionIds": [],
    "benchEnabled": false,
    "boostableSkinCount": 0,
    "chatDetails": {
        "chatRoomName": "579425d9-6483-4424-a7f3-b3f7f32a12f5@champ-select.pvp.net",
        "chatRoomPassword": null
    },
    "counter": 15,
    "entitledFeatureState": {
        "additionalRerolls": 0,
        "unlockedSkinIds": []
    },
    "gameId": 4329353079,
    "hasSimultaneousBans": true,
    "hasSimultaneousPicks": false,
    "isCustomGame": false,
    "isSpectating": false,
    "localPlayerCellId": 8,
    "lockedEventIndex": -1,
    "myTeam": [
        {
            "assignedPosition": "utility",
            "cellId": 5,
            "championId": 0,
            "championPickIntent": 0,
            "entitledFeatureType": "NONE",
            "selectedSkinId": 0,
            "spell1Id": 3,
            "spell2Id": 4,
            "summonerId": 105070055,
            "team": 2,
            "wardSkinId": -1
        },
        {
            "assignedPosition": "jungle",
            "cellId": 6,
            "championId": 0,
            "championPickIntent": 876,
            "entitledFeatureType": "NONE",
            "selectedSkinId": 0,
            "spell1Id": 4,
            "spell2Id": 11,
            "summonerId": 47270120,
            "team": 2,
            "wardSkinId": -1
        },
        {
            "assignedPosition": "middle",
            "cellId": 7,
            "championId": 0,
            "championPickIntent": 84,
            "entitledFeatureType": "NONE",
            "selectedSkinId": 0,
            "spell1Id": 4,
            "spell2Id": 14,
            "summonerId": 47138975,
            "team": 2,
            "wardSkinId": -1
        },
        {
            "assignedPosition": "bottom",
            "cellId": 8,
            "championId": 0,
            "championPickIntent": 0,
            "entitledFeatureType": "NONE",
            "selectedSkinId": 0,
            "spell1Id": 7,
            "spell2Id": 4,
            "summonerId": 24629707,
            "team": 2,
            "wardSkinId": 1
        },
        {
            "assignedPosition": "top",
            "cellId": 9,
            "championId": 0,
            "championPickIntent": 0,
            "entitledFeatureType": "NONE",
            "selectedSkinId": 0,
            "spell1Id": 4,
            "spell2Id": 12,
            "summonerId": 2725646249157792,
            "team": 2,
            "wardSkinId": -1
        }
    ],
    "recoveryCounter": 0,
    "rerollsRemaining": 0,
    "skipChampionSelect": false,
    "theirTeam": [
        {
            "assignedPosition": "",
            "cellId": 0,
            "championId": 0,
            "championPickIntent": 0,
            "entitledFeatureType": "",
            "selectedSkinId": 0,
            "spell1Id": 0,
            "spell2Id": 0,
            "summonerId": 0,
            "team": 1,
            "wardSkinId": -1
        },
        {
            "assignedPosition": "",
            "cellId": 1,
            "championId": 0,
            "championPickIntent": 0,
            "entitledFeatureType": "",
            "selectedSkinId": 0,
            "spell1Id": 0,
            "spell2Id": 0,
            "summonerId": 0,
            "team": 1,
            "wardSkinId": -1
        },
        {
            "assignedPosition": "",
            "cellId": 2,
            "championId": 0,
            "championPickIntent": 0,
            "entitledFeatureType": "",
            "selectedSkinId": 0,
            "spell1Id": 0,
            "spell2Id": 0,
            "summonerId": 0,
            "team": 1,
            "wardSkinId": -1
        },
        {
            "assignedPosition": "",
            "cellId": 3,
            "championId": 0,
            "championPickIntent": 0,
            "entitledFeatureType": "",
            "selectedSkinId": 0,
            "spell1Id": 0,
            "spell2Id": 0,
            "summonerId": 0,
            "team": 1,
            "wardSkinId": -1
        },
        {
            "assignedPosition": "",
            "cellId": 4,
            "championId": 0,
            "championPickIntent": 0,
            "entitledFeatureType": "",
            "selectedSkinId": 0,
            "spell1Id": 0,
            "spell2Id": 0,
            "summonerId": 0,
            "team": 1,
            "wardSkinId": -1
        }
    ],
    "timer": {
        "adjustedTimeLeftInPhase": 25975,
        "internalNowInEpochMs": 1654281540993,
        "isInfinite": false,
        "phase": "BAN_PICK",
        "totalTimeInPhase": 30000
    },
    "trades": [],
    "reply_type": "lol-champ-select"
}
    }
  },
  methods: {
    changeRoute(route){
      // Unregister the listener..
      console.log("I RUNNN")
      ipcRenderer.removeListener('asynchronous-reply',this.ondata)
      clearInterval(this.polling)
      this.$router.push(route)
    },
    getSummonerById(id){
      ipcRenderer.send('asynchronous-message', {id:'lol-lobby-playercard',summonerId: id})
    }
  },
  created: function () {
    this.ondata = (event, data) => {

      // Dug
      console.log("DEBUG: Async Reply: ",data)

      // All replies should have a reply_type set.
      if(data.reply_type == undefined){
        console.log("ERROR UNSET REPLY_TYPE in DATA")
        return
      }

      // We have diconnected or auth error..
      if(data.reply_type == "lcu-disonnceted") {
        console.log("Disconnected..")
      }

      // Valid reply handlers
      switch(data.reply_type){
        case "current-summoner": {
          break
        }
        case "lol-match-history": {
          break
        }
        case "lol-ranked-stats": {
          break
        }
        case "lol-champ-select": {
          // We switch to the other view for
          // pregame lobbies which will
          // display player cards for each player
          for(let player of this.lobbyData['myTeam']){
            console.log("Wow")
            this.getSummonerById(player.summonerId)
          }
          break
        }
        case "lol-lobby-playercard": {
          this.lobbyPlayers.push(data)
          console.log(this.lobbyPlayers)
          break
        }
        default: {
          console.error("Handling for", data.reply_type, "is not implemented" )
          break
        }
      }
    }
    ipcRenderer.on('asynchronous-reply', this.ondata)


    // We are already in a champ select because we got navigated here..
    // just get the data again instead of being passed into this view..
    ipcRenderer.send('asynchronous-message', {id:'lol-champ-select'})


    // Listen for 404..
    this.polling = setInterval(function() {
      ipcRenderer.send('asynchronous-message', {id:'lol-champ-select'})
    }, 15000)

  }
}
</script>