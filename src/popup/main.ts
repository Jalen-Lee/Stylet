import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "reset-css"
import App from './App.vue'
import './index.scss'
import '../assets/iconfont.css'

const app = createApp(App)
console.log(888);
app.use(ElementPlus)
app.mount('#app')
