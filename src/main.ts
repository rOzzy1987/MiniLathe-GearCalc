import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'
import GlobalConfig from './bll/globalConfig'

GlobalConfig.loadAll().then(() => {
    createApp(App).mount('#app');
});
