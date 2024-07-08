<template>
  <v-container color="dark">
    <h2 class="overline">Daily Attendance</h2>
    <GChart
      v-if="ready"
      type="ColumnChart"
      :data="daily_attendance_summary"
      :options="daily_attendance_chartOptions"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { GChart } from "vue-google-charts/legacy";
export default {
  components: { GChart },
  data() {
    // TODO: finish generating summary
    return {
      ready: true,
      daily_attendance_summary: [],
      daily_attendance_chartOptions: {
        chart: {
          title: "Daily Summary",
        },
      },
    };
  },
  methods: {
    ...mapActions({}),
    async get_attendance_summary() {
      let response = await axios.get("get_attendance_summary");
      this.daily_attendance_summary = response.data;
    },
  },
  computed: {
    ...mapGetters({
      attendance_summary: "summary/attendance_summary",
      sales_summary: "summary/sales_summary",
    }),
  },
  created() {
    // get attendance summary
    this.get_attendance_summary();
  },
};
</script>

<style></style>
