<template>
  <div v-show='showError' style="background-color:red">
    <h1>LCU Disconnected</h1>
  </div>
  <button @click="refreshMatches()">Refresh Matches</button>
  <button @click="refreshCard()">Refresh PlayerCard</button>
  <table class="container">
    <td>
    <PlayerCard :data=playerCardInfo />
    </td>
    <td>
    <MatchHistoryItem v-for="match in matches"
      :key=match.gameId
      :data=match 
      :champion_name=champion_ids[match.participants[0].championId]
      />
    </td>
    </table>
</template>

<script>
// PUUID 74701d6a-61f7-51d7-8746-948ce4a23f81

import MatchHistoryItem from './components/MatchHistoryItem.vue'
import PlayerCard from './components/PlayerCard.vue'
const { ipcRenderer } = require('electron')

export default {
    pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  name: 'App',
  components: {
    MatchHistoryItem,
    PlayerCard
  },
  data(){
    return{
      showError: false,
      playerCardInfo: {},
      matches: {},
      champion_ids: {
        266: "Aatrox",
        103: "Ahri",
        84: "Akali",
        166: "Akshan",
        12: "Alistar",
        32: "Amumu",
        34: "Anivia",
        1: "Annie",
        523: "Aphelios",
        22: "Ashe",
        136: "AurelionSol",
        268: "Azir",
        432: "Bard",
        53: "Blitzcrank",
        63: "Brand",
        201: "Braum",
        51: "Caitlyn",
        164: "Camille",
        69: "Cassiopeia",
        31: "Chogath",
        42: "Corki",
        122: "Darius",
        131: "Diana",
        119: "Draven",
        36: "DrMundo",
        245: "Ekko",
        60: "Elise",
        28: "Evelynn",
        81: "Ezreal",
        9: "Fiddlesticks",
        114: "Fiora",
        105: "Fizz",
        3: "Galio",
        41: "Gangplank",
        86: "Garen",
        150: "Gnar",
        79: "Gragas",
        104: "Graves",
        887: "Gwen",
        120: "Hecarim",
        74: "Heimerdinger",
        420: "Illaoi",
        39: "Irelia",
        427: "Ivern",
        40: "Janna",
        59: "JarvanIV",
        24: "Jax",
        126: "Jayce",
        202: "Jhin",
        222: "Jinx",
        145: "Kaisa",
        429: "Kalista",
        43: "Karma",
        30: "Karthus",
        38: "Kassadin",
        55: "Katarina",
        10: "Kayle",
        141: "Kayn",
        85: "Kennen",
        121: "Khazix",
        203: "Kindred",
        240: "Kled",
        96: "KogMaw",
        7: "Leblanc",
        64: "LeeSin",
        89: "Leona",
        876: "Lillia",
        127: "Lissandra",
        236: "Lucian",
        117: "Lulu",
        99: "Lux",
        54: "Malphite",
        90: "Malzahar",
        57: "Maokai",
        11: "MasterYi",
        21: "MissFortune",
        62: "MonkeyKing",
        82: "Mordekaiser",
        25: "Morgana",
        267: "Nami",
        75: "Nasus",
        111: "Nautilus",
        518: "Neeko",
        76: "Nidalee",
        56: "Nocturne",
        20: "Nunu",
        2: "Olaf",
        61: "Orianna",
        516: "Ornn",
        80: "Pantheon",
        78: "Poppy",
        555: "Pyke",
        246: "Qiyana",
        133: "Quinn",
        497: "Rakan",
        33: "Rammus",
        421: "RekSai",
        526: "Rell",
        888: "Renata",
        58: "Renekton",
        107: "Rengar",
        92: "Riven",
        68: "Rumble",
        13: "Ryze",
        360: "Samira",
        113: "Sejuani",
        235: "Senna",
        147: "Seraphine",
        875: "Sett",
        35: "Shaco",
        98: "Shen",
        102: "Shyvana",
        27: "Singed",
        14: "Sion",
        15: "Sivir",
        72: "Skarner",
        37: "Sona",
        16: "Soraka",
        50: "Swain",
        517: "Sylas",
        134: "Syndra",
        223: "TahmKench",
        163: "Taliyah",
        91: "Talon",
        44: "Taric",
        17: "Teemo",
        412: "Thresh",
        18: "Tristana",
        48: "Trundle",
        23: "Tryndamere",
        4: "TwistedFate",
        29: "Twitch",
        77: "Udyr",
        6: "Urgot",
        110: "Varus",
        67: "Vayne",
        45: "Veigar",
        161: "Velkoz",
        711: "Vex",
        254: "Vi",
        234: "Viego",
        112: "Viktor",
        8: "Vladimir",
        106: "Volibear",
        19: "Warwick",
        498: "Xayah",
        101: "Xerath",
        5: "XinZhao",
        157: "Yasuo",
        777: "Yone",
        83: "Yorick",
        350: "Yuumi",
        154: "Zac",
        238: "Zed",
        221: "Zeri",
        115: "Ziggs",
        26: "Zilean",
        142: "Zoe",
        143: "Zyra"
}
    }
  },
  methods: {
    updateMatches(m){
      this.matches = m.games.games
    },
    refreshMatches(){
        ipcRenderer.send('asynchronous-message', 
        {id:'current-summoner'})
    },
    refreshCard(){
        ipcRenderer.send('asynchronous-message', 
        {id:'lol-ranked-stats', user: "Cropster"})
    }
  },
  created: function () {
    // Register ipc messaging
    const { ipcRenderer } = require('electron')
    ipcRenderer.on('asynchronous-reply', (event, data) => {

      // Dug
      console.log("DEBUG: Async Reply: ",data)

      // All replies should have a reply_type set.
      if(data.reply_type == undefined){
        console.log("ERROR UNSET REPLY_TYPE in DATA")
        return
      }

      // We have diconnected or auth error..
      if(data.reply_type == "lcu-disonnceted") {
        this.showError = true
        return
      } else {
        this.showError = false
      }

      // Valid reply handlers
      switch(data.reply_type){
        case "current-summoner": {
          this.matches = data.games.games
          break
        }
        case "lol-ranked-stats": {
          this.playerCardInfo = data
          break
        }
        case "lol-champ-select": {
          console.log(data)
          break
        }
        default: {
          console.error("Handling for", data.reply_type, "is not implemented" )
          break
        }
      }
    })


    //ipcRenderer.send('asynchronous-message', {id:'get-auth-token'})
    ipcRenderer.send('asynchronous-message', {id:'lol-ranked-stats', user: "Cropster"})
    


    // Poll for champion select state
    setInterval(function() {
      //ipcRenderer.send('asynchronous-message', {id:'lol-champ-select'})
    }, 15000)
    
    

    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
