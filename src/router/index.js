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
  },
  {
    path: '/search',
    name: 'searchView',
    component: () => import('../views/searchView.vue')
  }
  ,
  {
    path: '/bookmarks',
    name: 'bookmarksView',
    component: () => import('../views/bookmarksView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
