import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'
import Vuetify from "vuetify";

Vue.config.productionTip = false

Vue.prototype.$axios = axios;

Vue.use(Vuetify, {
  iconfont: "md"
})

new Vue({
  render: function (h) { return h(App) }
}).$mount('#app')
