import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import App from './App.vue';
import HomeView from './HomeView.vue';
import LobbyView from './LobbyView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/lobby', name: 'Lobby', component: LobbyView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
