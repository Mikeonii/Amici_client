<template>
  <div>
    <v-btn @click="dialog = true">Expired Accounts</v-btn>
    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-card-title>Expired Accounts</v-card-title>
        <v-card-text>
          <div class="d-flex">
            <v-select
              label="Month"
              :items="months"
              item-text="name"
              item-value="value"
              v-model="selectedMonth"
            >
            </v-select>
            <v-select
              label="Years"
              :items="years"
              class="ml-2"
              v-model="selectedYear"
            ></v-select>
          </div>
          <v-data-table :items="items" :headers="headers"></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      items: [],
      selectedMonth: "",
      selectedYear: "",
      headers: [
        { text: "Account Name", value: "name" },
        { text: "Monthly Expiry Date", value: "expiry_date" },
      ],
      months: [
        { name: "January", value: 1 },
        { name: "February", value: 2 },
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
      ],
      years: [2024, 2025, 2026, 2027],
      dialog: false,
      button_loading: false,
    };
  },
  methods: {
    submit() {
      this.loading = true;
      axios
        .get("expiredMembers/" + this.selectedMonth + "/" + this.selectedYear)
        .then((res) => {
          this.items = res.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching expired members:", error);
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
