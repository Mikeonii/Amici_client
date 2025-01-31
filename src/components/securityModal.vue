<template>
  <v-dialog v-model="security" width="400">
    <v-card>
      <v-card-title>Security Password</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="security_answer"
          prepend-icon="mdi-lock"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="check">Proceed</v-btn>
        <v-btn @click="$emit('close')">Close</v-btn>
        <v-spacer></v-spacer>
        <p class="caption">securityModal.vue</p>
      </v-card-actions>
    </v-card>
    <!-- lazy -->
    <alert-modal
      :message="alertMessage"
      v-if="enableAlert"
      @close="enableAlert = false"
    />
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: { alertModal: () => import("./alertModal.vue") },
  data() {
    return {
      alertMessage: "",
      enableAlert: false,
      security_answer: "",
      security_code: "",
      security: true,
    };
  },
  computed: {
    ...mapGetters({
      app_settings: "auth/app_settings",
    }),
  },
  methods: {
    check() {
      if (this.security_answer != this.security_code) {
        this.alertMessage = "Wrong Password";
        this.enableAlert = true;
      } else {
        this.$emit("passed", true);
      }
    },
  },
  created() {
    this.security_code = this.app_settings.app_security_code;
  },
};
</script>

<style></style>
