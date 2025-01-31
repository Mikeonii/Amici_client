<template>
  <v-dialog v-model="dialog" width="300">
    <v-card class="text-align-center">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text
        ><p>{{ message }}</p>

        <v-btn small @click="$emit('close')">Close</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Alert",
    },
    message: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialog: true,
    };
  },
};
</script>

<style></style>
