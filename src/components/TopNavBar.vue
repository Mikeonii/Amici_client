<template>
  <v-toolbar flat class="mb-10 top_bar" color="" v-if="user">
    <v-toolbar-title class="font-weight-thin display-1">{{
      page_name
    }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text class="">
      <v-icon class="pr-2">mdi-spider-thread</v-icon>
      Report a Bug
    </v-btn>

    <v-btn text class="">
      <v-icon class="pr-2">mdi-account-hard-hat</v-icon>
      Role: {{ user.role }}
    </v-btn>
    <v-btn text class="">
      <v-icon class="pr-2">mdi-account-circle</v-icon>
      {{ user.first_name }}
    </v-btn>
    <v-btn text class="" :loading="loading" @click="logout()">
      <v-icon class="pr-2">mdi-logout</v-icon>
      Sign-out
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false,
    };
  },
  props: ["page_name"],
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  created() {
    // console.log(this.user);
  },
  methods: {
    ...mapActions({
      signout: "auth/signout",
    }),
    logout() {
      this.loading = true;
      this.signout().then(() => {
        this.loading = false;
        this.$router.push("/signin");
      });
    },
  },
};
</script>

<style scoped></style>
