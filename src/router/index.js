import { createRouter, createWebHashHistory } from 'vue-router'
import homeView from "../views/homeView.vue";

const routes = [
  {
    path: '/',
    name: 'homeView',
    component: homeView
  },
  {
    path: '/read/:page',
    name: 'readView',
    component: () => import('../views/readView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
