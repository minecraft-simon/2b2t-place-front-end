import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies';
import panZoom from 'vue-panzoom'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(panZoom);
Vue.use(VueCookies);
Vue.use(VueCompositionAPI)

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
