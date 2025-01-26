<template>
  <div>
    <v-snackbar
      value="true"
      timeout="-1"
      right
      shaped
      top
      :color="color"
      :icon="icon"
      dark
      border="left"
      prominent
      width="650"
    >
      <v-row>
        <v-col cols="1" class="mt-4">
          <v-icon x-large>{{ icon }}</v-icon></v-col
        >
        <v-col cols="">
          <p class="pa-2">
            {{ message }}
          </p></v-col
        >
        <v-col cols="3">
          <v-btn color="grey" class="mb-2" @click="confirm">Yes</v-btn>
          <v-btn @click="cancel">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-snackbar>
  </div>
</template>

<script>
// import { mapActions } from "vuex";
export default {
  props: ["type", "message", "will_confirm", "color", "icon"],
  data() {
    return {};
  },
  created() {},
  methods: {
    // ...mapActions({
    //   confirm_action: "notification/confirm",
    // }),
    confirm() {
      this.$emit("confirm-event");
    },
    cancel() {
      this.$emit("cancel-event");
    },
  },
};
</script>

<style scoped></style>
