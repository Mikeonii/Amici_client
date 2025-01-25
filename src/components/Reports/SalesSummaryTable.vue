<template>
  <v-container color="dark">
    <h2 class="overline">Sales Summary - {{ year }}</h2>
    <GChart
      v-if="ready"
      type="ColumnChart"
      :data="sales_summary"
      :options="sales_summary_chartOptions"
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
    return {
      ready: true,
      sales_summary: [],
      sales_summary_chartOptions: {
        chart: {
          title: "Sales Summary ",
        },
      },
    };
  },
  methods: {
    ...mapActions({}),
    async get_attendance_summary() {
      let response = await axios.get("/get_sales_summary");
      console.log("sales summary", response.data);
      this.sales_summary = response.data;
    },
  },
  computed: {
    year() {
      var date = new Date();
      var year = date.getFullYear();
      return year;
    },

    ...mapGetters({
      attendance_summary: "summary/attendance_summary",
    }),
  },
  created() {
    // get attendance summary
    this.get_attendance_summary();
  },
};
</script>

<style></style>
