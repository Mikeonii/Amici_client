<template>
  <v-toolbar flat class="mb- top_bar" color="grey lighten-3" v-if="user">
    <v-row>
      <v-col cols="3"></v-col>
      <v-col cols="6">
        <v-toolbar-title class="font-weight-thin display-1 mr-16">{{
          page_name
        }}</v-toolbar-title></v-col
      >
      <v-col cols="3" class="d-flex">
        <p class="mt-2 font-weight-bold">{{ user.name }}</p>
        <v-btn text class="">
          <v-icon class="pr-2">mdi-spider-thread</v-icon>
          Report a Bug
        </v-btn>
        <v-btn text class="" :loading="loading" @click="logout()">
          <v-icon class="pr-2">mdi-logout</v-icon>
          Sign-out
        </v-btn></v-col
      >
    </v-row>
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
  props: { page_name: String },
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
