<template>
  <div :class='`matchItem ${data.participants[0].stats.win ? "Victory" : "Defeat"}`'>
    <table>
      <tbody>
        <tr>
          <td>
            <div>
              <!-- Gamemode and Preview -->
              <span>{{data.gameType}}</span>
              <span>{{data.gameCreation}}</span>
              <hr style="width:10px;">
              <span>{{data.participants[0].stats.win ? "Victory" : "Defeat"}}</span>
              <span>{{data.gameDuration}}</span>
            </div>
          </td>
          <td>
            <div>
              <!-- Icon summoners, and champ name -->
              <div>
                <!-- 2x2 -->
                <table style="display:inline;">
                  <td style="padding:0px;vertical-align:bottom;">
                    <img :src="'http://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/'+champion_name+'.png'" style="width:50px;height:50px">
                    </td>
                   <td style="padding:0px;">
                     <!-- Summoner Spells -->
                      <img src="http://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/SummonerFlash.png" class='thumbicon'>
                      <br>
                      <img src="http://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/SummonerHeal.png" class='thumbicon'>
                    </td>
                    <td style="padding:0px;">
                      <!-- Runes -->
                     <img src="https://pbs.twimg.com/profile_images/1523868254514515970/5CnAiD-0_400x400.jpg" class='thumbicon'>
                     <br>
                     <img src="https://pbs.twimg.com/profile_images/1523868254514515970/5CnAiD-0_400x400.jpg" class='thumbicon'>
                   </td>
                </table>
                <br>
                <span style="font-size:8px;">{{champion_name}}</span>
              </div>
            </div>
          </td>
          <td>
            <!-- K/D/A -->
            <span>{{data.participants[0].stats.kills}} / {{data.participants[0].stats.deaths}} / {{data.participants[0].stats.assists}}</span>
          </td>
          <td>
            <!-- Personal Stats -->
            <span>Level {{data.participants[0].stats.champLevel}}</span>
            <span>{{data.participants[0].stats.totalMinionsKilled}} (1.0) CS</span>
            <span>P/Kill 10%</span>
          </td>
          <td>
            <!-- Items -->
            <table>
              <td style="padding:0px;"><img :src="`${itemURL}${data.participants[0].stats.item0}.png`" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="`${itemURL}${data.participants[0].stats.item1}.png`" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="`${itemURL}${data.participants[0].stats.item2}.png`" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="`${itemURL}${data.participants[0].stats.item3}.png`" class='thumbicon'></td>
              <tr>
              <td style="padding:0px;"><img :src="`${itemURL}${data.participants[0].stats.item4}.png`" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="`${itemURL}${data.participants[0].stats.item5}.png`" class='thumbicon'></td>
              <td style="padding:0px;"><img :src="`${itemURL}${data.participants[0].stats.item6}.png`" class='thumbicon'></td>
              </tr>
            </table>
            <span style="font-size:8px;">Control Wards {{data.participants[0].stats.visionWardsBoughtInGame}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'MatchHistoryItem',
  
  props: {
    data: {
        type: Object
      },
    champion_name: {
        type: String,
        default: "Champion_Name"
    }
  },
  data(){
    return {
      itemURL: "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/item/",
      spellURL: "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/",
    }
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

td {
  padding: 10px;
}

span {
  display:block;
}

.matchItem {
  width:fit-content;
  min-width:600px;
  margin-bottom:10px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.thumbicon {
  width:20px;
  height:20px;
}
.Victory {
  background-color: #42f56c;
}
.Defeat {
  background-color: #f5427e;
}
</style>
