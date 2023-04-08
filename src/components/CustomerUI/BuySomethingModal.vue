<template>
  <div>
    <v-btn x-large @click="dialog = true">
      <v-icon x-large> mdi-cart-variant </v-icon>
      purchase
    </v-btn>

    <v-dialog v-model="dialog" width="700">
      <v-card>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style></style>
