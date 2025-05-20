<template>
  <div>
    <v-btn @click="verify" color="yellow">Sales</v-btn>
    <v-dialog v-model="dialog" width="800" persistent>
      <v-card>
        <v-card-title><h3>Sales Report</h3></v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2"><p class="mt-6 ml-2">Daily Sales:</p></v-col>
            <v-col class="d-flex">
              <v-select
                v-model="selectedMonth"
                class="ml-2"
                label="Month"
                :items="months"
                item-text="name"
                item-value="value"
              ></v-select>
              <v-select
                v-model="selectedDay"
                class="ml-2"
                label="Day"
                :items="days"
              ></v-select>

              <v-select
                v-model="selectedYear"
                class="ml-2"
                label="Year"
                :items="[2024, 2025, 2026, 2027]"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-btn
                @click="submit('daily')"
                color="primary"
                class="mt-3"
                :loading="button_loading"
                >Submit</v-btn
              ></v-col
            >
          </v-row>
          <v-row>
            <v-col cols="2"> <p class="mt-6 ml-2">Monthly Sales:</p></v-col>
            <v-col class="d-flex">
              <v-select
                v-model="selectedMonth"
                class="ml-2"
                label="Month"
                :items="months"
                item-text="name"
                item-value="value"
              ></v-select>
              <v-select
                v-model="selectedYear"
                class="ml-2"
                label="Year"
                :items="[2024, 2025, 2026, 2027]"
              ></v-select
            ></v-col>
            <v-col cols="2">
              <v-btn
                @click="submit('monthly')"
                color="primary"
                class="mt-3"
                :loading="button_loading"
                >Submit</v-btn
              ></v-col
            >
          </v-row>
        </v-card-text>
        <v-card-actions>
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
    <alert-modal
      v-if="alertModal"
      :message="alertMessage"
      @close="alertModal = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AlertModal from "../alertModal.vue";

export default {
  components: {
    securityModal: () => import("@/components/securityModal.vue"),
    AlertModal,
  },
  data() {
    return {
      alertModal: false,
      alertMessage: "",
      enable_security: "",
      selectedMonth: "",
      selectedYear: "",
      selectedDay: "",
      dialog: false,
      button_loading: false,
      test: "",
    };
  },
  computed: {
    ...mapGetters({
      default_server_url: "auth/default_server_url",
      user: "auth/user",
    }),
    days() {
      let arr = [];
      let x;
      for (x = 1; x <= 31; x++) {
        arr.push(x);
      }
      return arr;
    },
    months() {
      let months = [
        { name: "January", value: 1 },
        { name: "Febuary", value: 2 },
        { name: "March", value: 3 },
        { name: "April", value: 4 },
        { name: "May", value: 5 },
        { name: "June", value: 6 },
        { name: "July", value: 7 },
        { name: "August", value: 8 },
        { name: "September", value: 9 },
        { name: "October", value: 10 },
        { name: "November", value: 11 },
        { name: "December", value: 12 },
      ];
      return months;
    },
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
    async submit(type) {
      if (this.user.username !== "admin") {
        this.alertMessage = "You are not allowed to perform this action";
        this.alertModal = true;

        return;
      }
      let url;
      if (type == "monthly") {
        url =
          this.default_server_url +
          "/print_monthly_sales/" +
          this.selectedMonth +
          "/" +
          this.selectedYear;
      } else {
        url =
          this.default_server_url +
          "/print_daily_sales/" +
          this.selectedDay +
          "/" +
          this.selectedMonth +
          "/" +
          this.selectedYear;
      }
      window.open(url);
    },
  },
};
</script>

<style></style>
