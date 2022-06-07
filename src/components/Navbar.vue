<template>
    <div class="wrapper">
        <div class="item">
            <router-link :to="{ name: 'Home', params: { summonerSearch: summonerSearch, submitSearch: true }}">
                Profile
            </router-link>
        </div>
        <div class="item">
            <router-link to="pregame">
                Lobby
            </router-link>
        </div>
        <div class="item">
            <form @submit.prevent="searchSummoner()">
                <input v-model=summonerSearch type="text" class="inputbox" placeholder="🔍 Search">
            </form>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron')
    export default {
        name: "NavBar",
        data() {
            return {
                summonerSearch: "",
            }
        },
        methods: {
            searchSummoner(){
                if(this.$route.path != "/"){
                    this.$router.push({ name: 'Home', params: { summonerSearch: this.summonerSearch }})
                }
                ipcRenderer.send('asynchronous-message', {id:'lol-ranked-stats', user: this.summonerSearch})
                ipcRenderer.send('asynchronous-message', {id:'lol-match-history', user: this.summonerSearch, begIndex: 0, endIndex: 9})
            }
        }
    }
</script>

<style scoped>
input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  display: inline-block;
  border:none;
  border-radius: 4px;
  box-sizing: border-box;
}

.wrapper {
    z-index:100;
    display: flex;
    top:0px;
    left:0px;
    height:44px;
    position:fixed;
    background-color:#191a1d;
    width: 100%;
    margin-bottom:10px;
}
.inputbox {
    color:#f2ecff;
    height:20px;
    border-radius:4px;
    background-color: #161818;
}
.item {
    padding:10px;
    font-size: 20px;
    display: flex;
}
.item a{
    text-decoration:none;
    color:#f2ecff;
}
</style>