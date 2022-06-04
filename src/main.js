import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'


import App from './App.vue'
import HomeView from './home.vue'
import About from './about.vue'
import PregameLobby from './pregamelobby.vue'

const routes = [
    { path: '/', Name: "Home", component: HomeView},
    { path: '/about', Name: "About", component: About},
    { path: '/pregame', Name: "Pregame", component: PregameLobby},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const app = createApp(App);
app.use(router);
app.mount('#app');