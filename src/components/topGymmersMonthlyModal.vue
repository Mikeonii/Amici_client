<template>
  <div>
    <v-btn @click="dialog = true">Monthly Top Gym-Goers</v-btn>
    <v-dialog v-model="dialog" width="900" persistent>
      <v-card>
        <v-card-title>Top Monthly Gym-Goers</v-card-title>
        <v-card-text>
          <div class="d-flex">
            <h3 class="mr-4 mt-6">Search for Month and Year</h3>
            <v-select
              class="mr-5"
              :items="months"
              label="Month"
              v-model="selectedMonth"
            ></v-select>
            <v-select
              :items="[2024, 2025, 2026]"
              label="Year"
              v-model="selectedYear"
            ></v-select>
            <v-btn class="ml-5" color="primary" @click="search">Search</v-btn>
          </div>

          <v-data-table
            :items="topGymGoers"
            :headers="headers"
            :sort-by="['attendances_count']"
            :sort-desc="[true]"
            v-if="topGymGoers.length > 0"
          >
            <template v-slot:item.no="{ _, index }">
              <p>{{ index + 1 }}</p>
            </template>
            <template v-slot:item.action="{ item }">
              <div class="pa-2">
                <v-avatar size="40" color="grey darken-3">
                  <h2
                    v-if="
                      item.profile_picture_url == 'n/a' ||
                      item.profile_picture_url == null
                    "
                    class="white--text"
                  >
                    {{ item.name.charAt(0) }}
                  </h2>
                  <v-img
                    v-else
                    :src="item.profile_picture_url"
                    width="100%"
                  ></v-img>
                </v-avatar>
              </div>
            </template>
            <template v-slot:item.rank="{ item }">
              <div>
                <v-btn text :color="get_rank(item.rank).color" large
                  >{{ item.rank }}

                  <v-icon v-for="i in get_rank(item.rank).stars" :key="i">
                    mdi-star
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:item.formatted_gym_time="{ item }">
              <p>{{ Math.floor(item.total_gym_time / 60) }} Hours</p>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
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
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      selectedMonth: "",
      selectedYear: "",
      dialog: false,
      button_loading: false,
      topGymGoers: [],
      headers: [
        { text: "No.", value: "no" },
        { text: "", value: "action" },
        { text: "Name", value: "name" },
        { text: "Rank", value: "rank" },
        { text: "Total Att. Rows", value: "attendances_count" },
        { text: "Total Gym Time", value: "formatted_gym_time" },
      ],
    };
  },
  methods: {
    get_rank(rank) {
      if (rank == "Novice") return { color: "brown", stars: 1 };
      if (rank == "Lifter") return { color: "blue", stars: 2 };
      if (rank == "Veteran") return { color: "grey", stars: 3 };
      if (rank == "Master") return { color: "yellow ", stars: 4 };
      if (rank == "Legendary") return { color: "red", stars: 5 };
      if (rank == "Beast") return { color: "deep-orange accent-3", stars: 6 };
    },
    async search() {
      let response = await axios.get(
        "/get_top_gymmer_of_the_month/" +
          this.selectedMonth +
          "/" +
          this.selectedYear
      );
      this.topGymGoers = response.data;
    },
    submit() {
      return;
    },
  },
};
</script>

<style></style>
