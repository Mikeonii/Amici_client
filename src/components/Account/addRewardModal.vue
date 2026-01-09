<template>
  <div>
    <v-btn @click="dialog = true" color="yellow">Add Rewards</v-btn>
    <v-dialog v-model="dialog" width="900" persistent>
      <v-card>
        <v-card-title>Add Reward</v-card-title>
        <v-card-text>
          <h3>Rewards</h3>
          <v-row>
            <v-col>
              <v-text-field
                label="Top 1 - 3"
                :value="form.rankA"
                prepend-icon="mdi-medal"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Top 4 - 6"
                :value="form.rankB"
                prepend-icon="mdi-medal"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Top 7 - 10"
                :value="form.rankC"
                prepend-icon="mdi-medal"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                v-model="form.month"
                :items="months"
                label="Month"
              ></v-select>

              <v-select
                v-model="form.year"
                :items="years"
                label="Year"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h4>Selected Rank A (Top 1-3)</h4>
              <ol>
                <li v-for="account in form.selectedRankA" :key="account.id">
                  {{ account.name }}
                </li>
              </ol>
              <v-btn @click="selectRank('A')" color="primary">Select A</v-btn>
              <v-btn @click="clearSelection('A')" class="ml-2">Clear</v-btn>
            </v-col>
            <v-col>
              <h4>Selected Rank B (Top 4-6)</h4>
              <ol start="4">
                <li v-for="account in form.selectedRankB" :key="account.id">
                  {{ account.name }}
                </li>
              </ol>
              <v-btn @click="selectRank('B')" color="primary">Select B</v-btn>
              <v-btn @click="clearSelection('B')" class="ml-2">Clear</v-btn>
            </v-col>
            <v-col>
              <h4>Selected Rank C (Top 7-10)</h4>
              <ol start="7">
                <li v-for="account in form.selectedRankC" :key="account.id">
                  {{ account.name }}
                </li>
              </ol>
              <v-btn @click="selectRank('C')" color="primary">Select C</v-btn>
              <v-btn @click="clearSelection('C')" class="ml-2">Clear</v-btn>
            </v-col>
          </v-row>

          <div class="d-flex">
            <v-text-field v-model="search"></v-text-field>
            <v-btn @click="get_accounts" color="success"
              ><v-icon class="mr-2">mdi-refresh</v-icon>Refresh</v-btn
            >
          </div>
          <v-data-table
            v-model="selected_accounts"
            :search="search"
            :items="accounts"
            :headers="headers"
            show-select
            single-select
          >
          </v-data-table>
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
import { mapGetters } from "vuex";
import axios from "axios";
import { mapActions } from "vuex/dist/vuex.common.js";
export default {
  data() {
    return {
      selected_accounts: [],
      form: {
        month: "",
        year: "",
        selectedRankA: [],
        selectedRankB: [],
        selectedRankC: [],
        rankA: 10,
        rankB: 7,
        rankC: 5,
      },
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      years: [2025, 2026, 2027],
      search: "",
      dialog: false,
      button_loading: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Account Name", value: "name" },
        { text: "Rank", value: "rank" },
        { text: "Monthly Expiry", value: "expiry_date" },
        { text: "Yearly Expiry", value: "yearly_expiry_date" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      accounts: "account/accounts",
    }),
  },
  methods: {
    ...mapActions({
      get_accounts: "account/getAccounts",
    }),
    clearSelection(rank) {
      if (rank === "A") {
        this.form.selectedRankA.pop();
      } else if (rank === "B") {
        this.form.selectedRankB.pop();
      } else if (rank === "C") {
        this.form.selectedRankC.pop();
      }
    },

    async submit() {
      let message =
        "Are you sure you want to assign rewards to the selected accounts?";
      if (!confirm(message)) {
        return;
      }

      if (!this.form.month || !this.form.year) {
        alert("Please select both month and year.");
        return;
      }

      this.button_loading = true;

      try {
        await axios.post("/assign_rewards", this.form);
        alert("Rewards assigned successfully!");

        this.dialog = false;
      } catch (error) {
        alert("Error assigning rewards: " + error.message);
      } finally {
        this.button_loading = false;
      }

      // Here you would dispatch an action to save the rewards
      // e.g., this.$store.dispatch('account/assignRewards', this.form)
    },
    selectRank(rank) {
      if (!this.selected_accounts.length) {
        return;
      }
      if (rank === "A") {
        this.form.selectedRankA.push(this.selected_accounts[0]);
      } else if (rank === "B") {
        this.form.selectedRankB.push(this.selected_accounts[0]);
      } else if (rank === "C") {
        this.form.selectedRankC.push(this.selected_accounts[0]);
      }
      console.log(
        `Accounts selected for Rank ${rank}:`,
        this.selected_accounts
      );

      // Clear selection in the table after assigning them
      this.selected_accounts = [];
    },
  },
};
</script>

<style></style>
