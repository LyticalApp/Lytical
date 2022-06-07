<template>
  <NavBar />
  <router-view />
</template>

<script>

import NavBar from './components/Navbar.vue'

export default {
  name: 'App',
  components:{
    NavBar,
  }
}
</script>