<template>
  <v-container>
    <v-row class="mb-2">
      <v-col> <h3>Attendance List Table</h3></v-col>
    </v-row>
    <v-data-table :items="attendances" :headers="headers"> </v-data-table>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "account.name" },
        { text: "Logged In", value: "logged_in" },
        { text: "Logged Out", value: "logged_out" },
        { text: "Total Time", value: "total_hours" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      attendances: "attendance/attendances",
    }),
  },
  methods: {
    ...mapActions({
      get_attendances: "attendance/get_attendances",
      get_top_gymmers: "account/get_top_gymmers",
    }),
  },
  mounted() {
    if (this.attendances.length == 0) {
      this.progress_linear = true;
      this.get_attendances();
      this.get_top_gymmers();
    }
  },
};
</script>

<style></style>
