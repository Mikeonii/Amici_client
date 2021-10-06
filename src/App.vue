<template>
  <v-app
    color="primary "
    :style="{ background: $vuetify.theme.themes[theme].background }"
  >
    <div v-if="page_ready">
      <TheNavBar />
      <TopNavBar :page_name="currentRouteName" />
      <v-main>
        <!-- alert notification -->
        <notification />
        <transition name="router_anim" mode="out-in">
          <router-view />
        </transition>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import TopNavBar from "@/components/TopNavBar.vue";
import TheNavBar from "@/components/TheNavBar.vue";

import Notification from "./components/Notification.vue";
export default {
  components: {
    TheNavBar,
    TopNavBar,
    Notification,
  },
  name: "App",

  data: () => ({
    page_ready: true,
    hide_nav: true,
    hide_top_nav: true,
  }),

  mounted() {
    this.check_user();
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },

    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
  methods: {
    ...mapActions({
      attempt: "auth/attempt",
    }),
    async check_user() {
      // var token = localStorage.getItem("token");
      // if (token) {
      //   this.attempt(token).then(() => {
      //     this.$router.push("/");
      //   });
      // }
    },
  },
};
</script>
<style>
.title {
  font-size: 120px;
}
.router_anim-enter {
  opacity: 0;
  transform: translateX(-200px);
}
.router_anim-enter-active {
  transition: all 0.2s ease;
}
.router_anim-leave-to {
  opacity: 0;
  transform: translateX(200px);
}
.router_anim-leave-active {
  transition: all 0.2s ease;
}
/* .page {
  position: fixed;
  width: inherit;
} */
</style>
