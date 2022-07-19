<template>
    <div>
        <div class="navWrapper">
            <div :class='`item ${ viewingHome ? "underlined" : ""}`'>
                <router-link
                :to="{
                  name: 'Home',
                  params: { summonerSearch: summonerSearch }}">
                    Profile
                </router-link>
            </div>
            <div :class='`item ${ viewingLobby ? "underlined" : ""}`'>
                <router-link to="Lobby">
                    Lobby
                </router-link>
            </div>
            <div class="item">
                <form @submit.prevent="searchSummoner(summonerSearch)">
                    <input v-model=summonerSearch
                    type="Search"
                    class="inputbox"
                    placeholder="🔍 Search">
                </form>
            </div>
            <!-- Settings Menu Button -->
            <div style="position:absolute;right:12px;top:12px;margin:0 auto;">
              <img  @click="reload()"
                :src='`assets/refresh-svg.svg`'
                style="height:20px;opacity:.2;padding-right:10px;color:white;">
                <img  @click="this.showSettings = !this.showSettings"
                :src='`assets/settings.svg`'
                style="height:20px;opacity:.2;">
            </div>
        </div>
        <SettingsMenu v-show="showSettings" />
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
      showSettings: false,
      viewingLobby: false,
      viewingHome: true,
      summonerSearch: '',
    };
  },
  methods: {
    searchSummoner(summoner) {
      this.$router.push({
        name: 'Home',
        params: { summonerSearch: summoner },
      });
    },
    reload() {
      if (this.viewingHome) {
        this.$router.push({
          name: 'Home',
          // Appending a blank space to the end of the username allow the route to update
          // Tried the this.$router.go() but the params got eaten..
          // eslint-disable-next-line no-underscore-dangle
          params: { summonerSearch: `${this.$router.currentRoute._value.params.summonerSearch} ` },
        });
      } else {
        this.$router.go();
      }
    },
  },
  watch: {
    $route() {
      switch (this.$route.path) {
        case '/': {
          this.viewingLobby = false;
          this.viewingHome = true;
          break;
        }
        case '/Lobby': {
          this.viewingLobby = true;
          this.viewingHome = false;
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
    height:42px;
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
    background-color: #080808a3;
}
.item {
    font-weight: lighter;
    padding:10px;
    padding-right:25px;
    font-size: 20px;
    display: flex;
}
.item a{
    text-decoration:none;
    color:#f2ecff;
}
</style>
