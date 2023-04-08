<template>
  <div>
    <v-card @click="dialog = true">
      <v-card-text>
        <v-row>
          <h2>Click me</h2>
        </v-row>
      </v-card-text>
    </v-card>
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
