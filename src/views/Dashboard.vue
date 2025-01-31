<template>
  <div>
    <div v-if="!show_navs">
      <attendance-table-view />
    </div>
    <div v-else class="pr-10 pl-10 pt-5">
      <div class="d-flex">
        <h1 class="">Welcome to Dashboard</h1>
        <v-spacer></v-spacer>
        <v-btn
          class="mb-6"
          :color="show_navs ? this.app_settings.app_color : 'grey'"
          @click="toggle_navs"
          >{{ show_navs == true ? "Start" : "Exit" }}</v-btn
        >
      </div>
      <file-uploader />
      <attendance-summary-table />
      <sales-summary-table />
      <v-row class="mt-4">
        <v-col><attendance-list-table /></v-col>
        <!-- test change -->
        <v-col><sales-list-table /></v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import AttendanceSummaryTable from "../components/Reports/AttendanceSummaryTable.vue";
import AttendanceTableView from "../components/AttendanceTableView.vue";
import AttendanceListTable from "../components/Reports/AttendanceListTable.vue";
import SalesSummaryTable from "../components/Reports/SalesSummaryTable.vue";
import SalesListTable from "../components/Reports/SalesListTable.vue";
import FileUploader from "../components/fileUploader.vue";
export default {
  components: {
    AttendanceSummaryTable,
    AttendanceListTable,
    AttendanceTableView,
    SalesSummaryTable,
    SalesListTable,
    FileUploader,
  },
  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      show_navs: "auth/show_navs",
      attendances: "attendance/attendances",
      top_gymmers: "account/top_gymmers",
      app_settings: "auth/app_settings",
    }),
  },
  methods: {
    ...mapActions({
      toggle_navs: "auth/toggle_navs",
    }),

    signout() {
      this.$store.dispatch("auth/signout").then(() => {
        window.location = "/signin";
      });
    },
  },
};
</script>

<style></style>
