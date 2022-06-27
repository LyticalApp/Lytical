<template>
    <div class="navWrapper">
    <div :class='`item ${ underlineHome ? "underlined" : ""}`'>
        <router-link :to="{ name: 'Home', params: { summonerSearch: summonerSearch, submitSearch: true }}">
            Profile
        </router-link>
    </div>
    <div :class='`item ${ underlineLobby ? "underlined" : ""}`'>
        <router-link to="pregame">
            Lobby
        </router-link>
    </div>
    <div class="item">
        <form @submit.prevent="searchSummoner()">
            <input v-model=summonerSearch type="text" class="inputbox" placeholder="🔍 Search">
        </form>
    </div>
    <!-- Settings Menu -->
    <div style="position:absolute;right:0px;">
        <button @click="this.showModal = !this.showModal">Settings</button>
    </div>
    </div>
    <div v-show="showModal" class="myModal">
    <div style="left:50%;margin:auto;">
        <h1>Settings</h1>
        <table style="left:50%;margin:auto; background-color:black;">
            <td>Option Name</td>
            <td>State</td>
            <tr>
                <td>Automaticly switch to lobby</td>
                <td>
                <input v-model="autoSwitchLobby" type="checkbox" :checked="autoSwitchLobby == 'true'">
                </td>
            </tr>
            <tr>
                <td>Option Name</td>
                <td>State</td>
            </tr>
            <tr>
                <td>Option Name</td>
                <td>State</td>
            </tr>
            <tr>
                <td>Option Name</td>
                <td>State</td>
            </tr>
        </table>
    </div>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron')
    export default {
        name: "NavBar",
        mounted() {
            this.mounted = true
            // Load settings because localStorage isn't ready until mount
            if (localStorage.autoSwitchLobby) {
                console.log("Mounted, setting to",  localStorage.getItem('autoSwitchLobby'))
                this.autoSwitchLobby = localStorage.getItem('autoSwitchLobby');
            }
        },
        data() {
            return {
                underlineHome: true,
                showModal: false,
                underlineLobby: false,
                summonerSearch: "",
                autoSwitchLobby: 'false',
            }
        },
        methods: {
            searchSummoner(){
                if(this.$route.path != "/"){
                    this.$router.push({ name: 'Home', params: { summonerSearch: this.summonerSearch }})
                }
                ipcRenderer.send('asynchronous-message', {id:'lol-ranked-stats', user: this.summonerSearch})
                ipcRenderer.send('asynchronous-message', {id:'lol-match-history', user: this.summonerSearch, begIndex: 0, endIndex: 9})
            },
        },
        watch:{
            $route (){
                switch(this.$route.path){
                    case "/": { 
                        this.underlineLobby = false;
                        this.underlineHome = true;
                        break
                    }
                    case "/pregame": {
                        this.underlineLobby = true;
                        this.underlineHome = false;
                        break
                    }
                }
            },
            autoSwitchLobby(state){
                console.log("autoswitchlobby updated", state)
                localStorage.setItem('autoSwitchLobby',state)
            }
        },
    }
</script>

<style scoped>
.myModal{
    height:100vh;
    width:100%;
    background:grey;
}
.myModal td {
    padding:10px;
}
input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  display: inline-block;
  border:none;
  border-radius: 4px;
  box-sizing: border-box;
}

.navWrapper {
    z-index:100;
    display: flex;
    top:0px;
    left:0px;
    height:44px;
    position:fixed;
    background-color:#191a1d;
    width: 100%;
}

.underlined a{
    text-underline-offset: 10px;
    text-decoration: underline !important;
    text-decoration-color: #5a4656 !important;
    transition: all .2s linear;
}
.inputbox {
    color:#f2ecff;
    height:20px;
    border-radius:4px;
    background-color: #161818;
}
.item {
    font-weight: lighter;
    padding:10px;
    padding-right:25px;
    font-size: 20px;
    display: flex;
}
.item a{
    font-family: 'Open Sans', sans-serif;
    font-weight: light;
    text-decoration:none;
    color:#f2ecff;
}
</style>