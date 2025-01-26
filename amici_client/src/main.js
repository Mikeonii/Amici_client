import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/storage";
// import VueGoogleCharts from "vue-google-charts";
// for authenticating thru headers with tokens
require("@/store/subscriber");

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwFo_cbuCaRg8n2WSiKHqyLnasHESOutI",
  authDomain: "jc-fitness-2faf9.firebaseapp.com",
  projectId: "jc-fitness-2faf9",
  storageBucket: "jc-fitness-2faf9.appspot.com",
  messagingSenderId: "554125990171",
  appId: "1:554125990171:web:11a9192f5cca676c411bbe",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.provductionTip = false;
axios.defaults.baseURL = "http://127.0.0.1:8000/api";
store.dispatch("auth/attempt", localStorage.getItem("token")).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});
