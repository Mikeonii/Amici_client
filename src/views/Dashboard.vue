<template>
  <div>
    <v-container class="">
      <v-btn :color="show_navs ? 'yellow' : 'grey'" @click="toggle_navs">{{
        show_navs == true ? "Start the system" : "Exit Page"
      }}</v-btn>
      <div v-if="!show_navs">
        <v-img src="@/assets/banner.jpg" width="" height="%" class="pa-9">
          <div class="d-flex">
            <v-avatar size="62">
              <img src="@/assets/logo.png" />
            </v-avatar>
            <v-row class="ml-2">
              <v-col>
                <h3 class="yellow--text mt-2">AMICI FITNESS SPA</h3>
                <h3 class="white--text overline mt-n2">Management System</h3>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="mt- d-flex justify-end">
                <p class="white--text">
                  <v-icon color="white">mdi-lightning-bolt</v-icon>Powered by:
                  JMBComputers
                </p>
              </v-col>
              <v-col>
                <check-account-modal />
              </v-col>
            </v-row>
          </div>

          <h2 class="display-4 font-weight-black white--text">{{ time }}</h2>
          <h2 class="display1 white--text">{{ get_date() }}</h2>

          <div>
            <v-text-field
              @change="insert_attendance()"
              autofocus
              dark
              label="ID Number"
              color="white"
              class="white--text"
              v-model="card_id"
            ></v-text-field>
          </div>

          <div class="mt-2">
            <v-data-table
              :items="attendances"
              :headers="headers"
              dark
              v-if="attendances.length > 0"
            >
              <template v-slot:item.action="{ item }">
                <div class="pa-2">
                  <v-avatar size="40" color="grey darken-3">
                    <h2>{{ item.account.name.charAt(0) }}</h2>
                  </v-avatar>
                </div>
              </template>
              <template v-slot:item.account_type="{ item }">
                <div>
                  <v-btn text :color="get_rank(item.account.rank).color" large
                    >{{ item.account.rank }}

                    <v-icon
                      v-for="i in get_rank(item.account.rank).stars"
                      :key="i"
                    >
                      mdi-star
                    </v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-img>
      </div>

      <div v-else>
        <h1>Welcome to Dashboard</h1>
      </div>
      <progress-linear :dialog="progress_linear" />
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import CheckAccountModal from "../components/CustomerUI/CheckAccountModal.vue";
import ProgressLinear from "../components/ProgressLinear.vue";
export default {
  components: { CheckAccountModal, ProgressLinear },
  data() {
    return {
      card_id: "",
      time: "",
      progress_linear: false,
      headers: [
        { text: "", value: "action" },
        { text: "Name", value: "account.name" },
        { text: "Account Type", value: "account_type" },
        { text: "Time Logged In", value: "logged_in" },
        { text: "Time Logged Out", value: "logged_out" },
        { text: "Total Time Spent", value: "total_hours" },
      ],
    };
  },

  computed: {
    ...mapGetters({
      show_navs: "auth/show_navs",
      attendances: "attendance/attendances",
    }),
  },
  methods: {
    get_rank(rank) {
      if (rank == "Minotaur") return { color: "brown", stars: 1 };
      if (rank == "Pegasus") return { color: "grey", stars: 2 };
      if (rank == "Phoenix") return { color: "yellow ", stars: 3 };
      if (rank == "Cerberus") return { color: "red", stars: 4 };
      if (rank == "Dragon") return { color: "deep-orange accent-3", stars: 5 };
    },
    insert_attendance() {
      setTimeout(() => {
        this.add_attendance(this.card_id).then(() => {
          this.card_id = "";
        });
      }, 100);
    },
    ...mapActions({
      toggle_navs: "auth/toggle_navs",
      get_attendances: "attendance/get_attendances",
      add_attendance: "attendance/add_attendance",
    }),
    signout() {
      this.$store.dispatch("auth/signout").then(() => {
        window.location = "/signin";
      });
    },
    get_date() {
      let date = moment().format("MMMM DD, YYYY");
      return date;
    },
    clock() {
      var time = moment().format("h:m:s A");
      this.time = time;
    },
  },
  mounted() {
    setInterval(this.clock, 1000);
    if (this.attendances.length == 0) {
      this.progress_linear = true;
      this.get_attendances().then(() => {
        this.progress_linear = false;
      });
    }
  },
};
</script>

<style></style>
