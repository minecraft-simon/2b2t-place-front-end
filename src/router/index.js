import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Place",
    component: () =>
        import(/* webpackChunkName: "place" */ "../views/Place.vue")
  },
  {
    path: "*",
    redirect: to => {
      return { path: '/' }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
