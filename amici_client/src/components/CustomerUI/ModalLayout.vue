<template>
  <div>
    <v-btn @click="dialog = true">Open</v-btn>
    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text> </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
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
      button_loading: false,
    };
  },
  methods: {
    submit() {
      return;
    },
  },
};
</script>

<style></style>
