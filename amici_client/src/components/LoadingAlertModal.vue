<template>
  <v-dialog v-model="dialog" width="400" persistent id="id">
    <v-card class="pr-10 pl-10 pb-5 pt-2"
      ><p class="overline blue--text text--darken-3">
        <v-icon class="mr-2" color="blue darken-3">mdi-information</v-icon>
        Loading: <strong>{{ data }}</strong>
      </p>
      <v-progress-linear
        indeterminate
        color="blue darken-2"
        class=""
        rounded
        height="4"
      ></v-progress-linear
    ></v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog", "data", "id"],
};
</script>

<style></style>
