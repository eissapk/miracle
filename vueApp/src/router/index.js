import { createRouter, createWebHashHistory } from 'vue-router'
import homeView from "../views/homeView.vue";
import readView from "../views/readView.vue";

const routes = [
  {
    path: '/',
    name: 'homeView',
    component: homeView
  },
  {
    path: '/read/:page',
    name: 'readView',
    component: readView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
