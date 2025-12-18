import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import socket from './services/socket'; // Importa o serviço do Socket.IO
import vuetify from './plugins/vuetify'; // Importa o plugin do Vuetify

const app = createApp(App);

// Torna o socket disponível globalmente
app.provide('$socket', socket);

app.use(store);
app.use(router);
app.use(vuetify); // Adiciona o Vuetify ao app
app.mount('#app');
