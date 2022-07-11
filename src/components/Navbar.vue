<template>
    <div>
        <div class="navWrapper">
            <div :class='`item ${ underlineHome ? "underlined" : ""}`'>
                <router-link
                :to="{
                  name: 'Home',
                  params: { summonerSearch: summonerSearch }}">
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
                    <input v-model=summonerSearch
                    type="Search"
                    class="inputbox"
                    placeholder="🔍 Search">
                </form>
            </div>
            <!-- Settings Menu Button -->
            <div style="position:absolute;right:12px;top:12px;margin:0 auto;">
                <img  @click="this.showSettings = !this.showSettings"
                :src='`assets/settings.svg`'
                style="height:20px;opacity:.2;">
            </div>
        </div>
        <SettingsMenu v-if="showSettings" />
    </div>
</template>

<script>
import SettingsMenu from './SettingsMenu.vue';

export default {
  name: 'NavBar',
  components: {
    SettingsMenu,
  },
  data() {
    return {
      underlineHome: true,
      showSettings: false,
      underlineLobby: false,
      summonerSearch: '',
    };
  },
  methods: {
    searchSummoner() {
      this.$router.push({
        name: 'Home',
        params: { summonerSearch: this.summonerSearch },
      });
    },
  },
  watch: {
    $route() {
      switch (this.$route.path) {
        case '/': {
          this.underlineLobby = false;
          this.underlineHome = true;
          break;
        }
        case '/pregame': {
          this.underlineLobby = true;
          this.underlineHome = false;
          break;
        }
        default: {
          console.log('Uncaught Route');
        }
      }
    },
  },
};
</script>

<style scoped>

input[type="search"] {
    width: 100%;
    padding: 14px 20px;
    display: inline-block;
    border:none;
    font-size:14px;
    border-radius: 4px;
    box-sizing: border-box;
}

input:focus {
    outline: none !important;
    border-color: #719ECE;
    box-shadow: 0 0 4px #719ECE;
 }

input[type="search"]:focus::-webkit-search-cancel-button {
  opacity: .4;
  pointer-events: all;
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
