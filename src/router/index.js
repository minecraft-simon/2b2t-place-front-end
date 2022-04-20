import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/asdf",
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
  {
    path: "*",
    redirect: to => {
      return { path: '/place' }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
