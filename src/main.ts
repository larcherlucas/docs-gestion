import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './style.css'

import App from './App.vue'
import router from './router'
import { createBootstrap } from 'bootstrap-vue-next'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast)
app.use(createBootstrap())  // Utilisez createBootstrap()

app.mount('#app')