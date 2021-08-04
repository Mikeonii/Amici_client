import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
// import VueGoogleCharts from "vue-google-charts";
// for authenticating thru headers with tokens 
require('@/store/subscriber')
Vue.config.provductionTip = false;
axios.defaults.baseURL = "http://127.0.0.1:8000/api";
store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");

});

