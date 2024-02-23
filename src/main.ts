import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {VueScreenSizeMixin} from "vue-screen-size";

createApp(App).mixin(VueScreenSizeMixin).mount('#app')
