import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'


import App from './App.vue'
import HomeView from './Home.vue'
import PregameLobby from './Pregame.vue'

const routes = [
    { path: '/', Name: "Home", component: HomeView},
    { path: '/pregame', Name: "Pregame", component: PregameLobby},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const app = createApp(App);
app.use(router);
app.mount('#app');