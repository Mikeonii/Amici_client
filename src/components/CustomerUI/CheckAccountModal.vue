<template>
  <div>
    <v-btn @click="dialog = true">
      <v-icon> mdi-account </v-icon>
      Check Account
    </v-btn>

    <v-dialog v-model="dialog" width="900">
      <v-card>
        <v-card-text class="pa-3">
          <account />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import Account from "../../views/Account.vue";
export default {
  components: { Account },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style></style>
