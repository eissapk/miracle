import homeView from "../views/homeView.vue";
import readView from "../views/readView.vue";
import * as VueRouter from "vue-router";

const routes = [
  { path: "/", component: homeView },
  { path: "/read/:page", component: readView },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
