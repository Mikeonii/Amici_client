<template>
  <div>
    <v-dialog v-model="dialog" width="1200" persistent>
      <v-card>
        <v-card-title>All Time Top Gym-Goers</v-card-title>
        <v-card-text>
          <v-data-table
            :items="top_gymmers"
            :headers="top_gymmers_header"
            v-if="top_gymmers.length > 0"
          >
            <template v-slot:item.no="{ _, index }">
              <p>{{ index + 1 }}</p>
            </template>
            <template v-slot:item.action="{ item }">
              <div class="pa-2">
                <v-avatar size="40" color="grey darken-3">
                  <h2 v-if="!item.profile_picture_url">
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
              <p>{{ item.total_gym_time / 60 }} Hours</p>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="$emit('close')">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      dialog: true,
      button_loading: false,

      top_gymmers_header: [
        { text: "No.", value: "no" },
        { text: "", value: "action" },
        { text: "Name", value: "name" },
        { text: "Rank", value: "rank" },
        { text: "Registered", value: "created_at" },
        { text: "Expiration Date", value: "expiry_date" },
        { text: "Total Att. Rows", value: "total_attendance_rows" },
        { text: "Total Gym Time", value: "formatted_gym_time" },
      ],
    };
  },
  computed: {
    ...mapGetters({ top_gymmers: "account/top_gymmers" }),
  },

  methods: {
    ...mapActions({
      get_top_gymmers: "account/get_top_gymmers",
    }),
    get_rank(rank) {
      if (rank == "Novice") return { color: "brown", stars: 1 };
      if (rank == "Lifter") return { color: "blue", stars: 2 };
      if (rank == "Veteran") return { color: "grey", stars: 3 };
      if (rank == "Master") return { color: "yellow ", stars: 4 };
      if (rank == "Legendary") return { color: "red", stars: 5 };
      if (rank == "Beast") return { color: "deep-orange accent-3", stars: 6 };
    },
    submit() {
      return;
    },
  },
  created() {
    if (this.top_gymmers.length <= 0) this.get_top_gymmers();
  },
};
</script>

<style></style>
