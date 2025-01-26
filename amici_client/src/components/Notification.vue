<template>
  <div>
    <v-snackbar
      :value="notification.showing"
      right
      shaped
      top
      :color="notification.color"
    >
      <div class="text-center">
        <v-icon class="pr-2">{{ notification.icon }}</v-icon
        >{{ this.notification.message }}
      </div>

      <!-- <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs">
          Close
        </v-btn>
      </template> -->
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return { snackbar: true };
  },
  computed: {
    ...mapState("notification", ["notification"]),
  },
  created() {
    // console.log(this.notification);
  },
};
</script>

<style></style>
