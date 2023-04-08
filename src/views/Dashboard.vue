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
              <v-col class="mt-4 ml-10 d-flex justify-end">
                <p class="white--text">
                  <v-icon color="white">mdi-lightning-bolt</v-icon>Powered by:
                  JMBComputers
                </p>
              </v-col>
            </v-row>
          </div>

          <h2 class="display-4 font-weight-black white--text">{{ time }}</h2>
          <h2 class="display1 white--text">{{ get_date() }}</h2>

          <div>
            <v-text-field
              autofocus
              dark
              label="ID Number"
              color="white"
              class="white--text"
            ></v-text-field>
          </div>
          <v-row>
            <v-col>
              <div class="d-flex">
                <buy-something-modal />
                <check-account-modal class="ml-2" />
                <add-credits-modal class="ml-2" />
              </div>
            </v-col>
          </v-row>
          <div class="mt-2">
            <v-data-table :items="attendances" :headers="headers" dark>
              <template v-slot:item.action="{ item }">
                <div class="pa-2">
                  <v-avatar size="40" color="grey darken-3">
                    <h2>{{ item.name.charAt(0) }}</h2>
                  </v-avatar>
                </div>
              </template>
              <template v-slot:item.account_type="{ item }">
                <div v-if="item.account_type == 'Platinum'">
                  <span class="">
                    {{ item.account_type }}
                    <v-icon color="yellow lighten-2">mdi-star</v-icon>
                    <v-icon color="yellow lighten-2">mdi-star</v-icon>
                    <v-icon color="yellow lighten-2">mdi-star</v-icon>
                    <v-icon color="yellow lighten-2">mdi-star</v-icon>
                  </span>
                </div>
                <div v-if="item.account_type == 'Gold'">
                  <span class="">
                    {{ item.account_type }}

                    <v-icon color="yellow darken-4">mdi-star</v-icon>
                    <v-icon color="yellow darken-4">mdi-star</v-icon>
                    <v-icon color="yellow darken-4">mdi-star</v-icon>
                  </span>
                </div>
                <div v-if="item.account_type == 'Silver'">
                  <span class="">
                    {{ item.account_type }}

                    <v-icon color="">mdi-star</v-icon>
                    <v-icon color="">mdi-star</v-icon>
                  </span>
                </div>
                <div v-if="item.account_type == 'Bronze'">
                  <span class="">
                    {{ item.account_type }}
                    <v-icon color="brown">mdi-star</v-icon>
                  </span>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-img>
      </div>
      <div v-else>
        <h1>Welcome to Dashboard</h1>
      </div>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import AddCreditsModal from "../components/CustomerUI/AddCreditsModal.vue";
import BuySomethingModal from "../components/CustomerUI/BuySomethingModal.vue";
import CheckAccountModal from "../components/CustomerUI/CheckAccountModal.vue";
export default {
  components: { BuySomethingModal, CheckAccountModal, AddCreditsModal },
  data() {
    return {
      time: "",
      attendances: [
        {
          name: "John Doe",
          account_type: "Platinum",
          logged_in: "08:30 AM",
          logged_out: "10:30 AM",
          total_time_spent: "2 Hours",
        },
        {
          name: "Sam Smith",
          account_type: "Bronze",
          logged_in: "08:30 AM",
          logged_out: "10:30 AM",
          total_time_spent: "2 Hours",
        },
        {
          name: "Mark Zuckerberg",
          account_type: "Gold",
          logged_in: "08:30 AM",
          logged_out: "10:30 AM",
          total_time_spent: "2 Hours",
        },
        {
          name: "Bill Gates",
          account_type: "Silver",
          logged_in: "08:30 AM",
          logged_out: "10:30 AM",
          total_time_spent: "2 Hours",
        },
        {
          name: "Elon Musk",
          account_type: "Platinum",
          logged_in: "08:30 AM",
          logged_out: "10:30 AM",
          total_time_spent: "2 Hours",
        },
      ],
      headers: [
        { text: "", value: "action" },
        { text: "Name", value: "name" },
        { text: "Account Type", value: "account_type" },
        { text: "Time Logged In", value: "logged_in" },
        { text: "Time Logged Out", value: "logged_out" },
        { text: "Total Time Spent", value: "total_time_spent" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      show_navs: "auth/show_navs",
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
    get_date() {
      let date = moment().format("MMMM DD, YYYY");

      return date;
    },
    clock() {
      var time = moment().format("h:m:s A");

      // Pad the values with leading zeroes if they are less than 10

      // Format the time string

      this.time = time;
    },
  },
  mounted() {
    setInterval(this.clock, 1000);
  },
};
</script>

<style></style>
