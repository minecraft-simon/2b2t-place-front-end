import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
        import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/place",
    name: "Place",
    component: () =>
        import(/* webpackChunkName: "place" */ "../views/Place.vue")
  },
]

const router = new VueRouter({
  routes
})

export default router
