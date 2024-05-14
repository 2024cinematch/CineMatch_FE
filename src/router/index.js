import MainPage from '@/views/MainPage.vue'
import MovieDetail from '@/views/MovieDetail.vue'
import RecommendPage from '@/views/RecommendPage.vue'
import SearchPage from '@/views/SearchPage.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: MainPage
  },
  {
    path:'/about',
    name: 'about',
    component: RecommendPage
  },
  {
    path:'/search',
    name:'search',
    component: SearchPage,
    props: true
  },
  {
    path:'/movie-detail',
    name:'movie-detail',
    component: MovieDetail
  }
  

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
