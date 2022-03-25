import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '/node_modules/bootstrap/dist/css/bootstrap.css'

createApp(App).use(router).mount('#app')

// app.config.globalProperties.msg = 'https://localhost:3000'
