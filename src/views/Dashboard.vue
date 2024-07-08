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
          class="mb-6 white--text"
          :color="show_navs ? 'purple' : 'grey'"
          @click="toggle_navs"
          >{{ show_navs == true ? "Start" : "Exit" }}</v-btn
        >
      </div>
      <attendance-summary-table />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import AttendanceSummaryTable from "../components/Reports/AttendanceSummaryTable.vue";
import AttendanceTableView from "../components/AttendanceTableView.vue";
export default {
  components: {
    AttendanceSummaryTable,
    AttendanceTableView,
  },
  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      show_navs: "auth/show_navs",
      attendances: "attendance/attendances",
      top_gymmers: "account/top_gymmers",
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
