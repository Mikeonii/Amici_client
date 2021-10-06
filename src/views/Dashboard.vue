<template>
  <div>
    <v-container class="">
      <h1>Welcome to Dashboard</h1>
    </v-container>
  </div>
</template>

<script>
export default {
  methods: {
    signout() {
      this.$store.dispatch("auth/signout").then(() => {
        window.location = "/signin";
      });
    },
  },
};
</script>

<style></style>
