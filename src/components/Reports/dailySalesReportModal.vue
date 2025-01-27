<template>
  <div>
    <v-btn @click="verify" color="yellow">Sales</v-btn>
    <v-dialog v-model="dialog" width="800" persistent>
      <v-card>
        <v-card-title><h3>Daily Sales</h3></v-card-title>
        <v-card-text>
          <div class="d-flex">
            <p class="mt-6 ml-2">Please select Date:</p>

            <v-select
              v-model="selectedMonth"
              class="ml-2"
              label="Month"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
            ></v-select>
            <v-select
              v-model="selectedYear"
              class="ml-2"
              label="Year"
              :items="[2024, 2025, 2026, 2027]"
            ></v-select>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="dialog = false">Close</v-btn>

          <v-spacer></v-spacer>
          <p class="caption">dailySalesReportModal.vue</p>
        </v-card-actions></v-card
      ></v-dialog
    >
    <!-- lazy components -->
    <security-modal
      v-if="enable_security"
      @passed="open_dialog"
      @close="enable_security = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {
    securityModal: () => import("@/components/securityModal.vue"),
  },
  data() {
    return {
      enable_security: "",
      selectedMonth: "",
      selectedYear: "",
      dialog: false,
      button_loading: false,
      test: "",
    };
  },
  computed: {
    ...mapGetters({
      default_server_url: "auth/default_server_url",
    }),
  },
  methods: {
    verify() {
      console.log("triggered");
      this.enable_security = true;
    },
    open_dialog() {
      this.enable_security = false;
      this.dialog = true;
    },
    async submit() {
      let x = window.confirm("Are you sure you want to proceed?");
      if (x) {
        let url =
          this.default_server_url +
          "/print_monthly_sales/" +
          this.selectedMonth +
          "/" +
          this.selectedYear;
        window.open(url);
      }
    },
  },
};
</script>

<style></style>
