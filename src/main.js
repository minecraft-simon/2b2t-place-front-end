import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies';
import panZoom from 'vue-panzoom'

Vue.use(panZoom);
Vue.use(VueCookies);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    this.$store.dispatch("loadCookies")
  }
}).$mount('#app')
