import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

import Dashboard from "../views/Dashboard.vue";
import Account from "../views/Account.vue";
import Signin from "../views/Signin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        console.log(store.getters["auth/authenticated"]);
        return next({ name: "Signin" });
      } else {
        next();
      }
    },
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: Account,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        console.log(store.getters["auth/authenticated"]);
        return next({ name: "Signin" });
      } else {
        next();
      }
    },
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
    beforeEnter: (to, from, next) => {
      if (store.getters["auth/authenticated"]) {
        next({ name: "Dashboard" });
      } else {
        next();
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
