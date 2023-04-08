import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth.js";
import notification from "./notification.js";
import action from "./action.js";
import admin from "./admin.js";
import account from "./account.js";
// import subscriber from "./subscriber.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    notification,
    action,
    admin,
    account,
    // subscriber
  },
});
