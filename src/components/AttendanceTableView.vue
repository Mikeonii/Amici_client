<template>
  <v-img src="@/assets/banner.jpg" width="" height="%" class="pa-9">
    <div class="d-flex">
      <v-avatar size="62">
        <img src="@/assets/jc_logo.jpg" />
      </v-avatar>
      <v-row class="ml-2">
        <v-col>
          <h3 class="purple--text mt-2">JC FITNESS GYM</h3>

          <h3 class="white--text overline mt-n2">Management System</h3>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="mt- d-flex justify-end">
          <p class="white--text">
            <v-icon color="white">mdi-lightning-bolt</v-icon>Powered by:
            JMBComputers
          </p>
        </v-col>
        <v-col class="d-flex">
          <check-account-modal />
          <v-btn
            class="mb-6 white--text ml-4"
            :color="show_navs ? 'purple' : 'grey'"
            @click="toggle_navs"
            >{{ show_navs == true ? "Start" : "Exit" }}</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col>
        <h2 class="display-4 font-weight-black white--text">
          {{ time }}
        </h2>
        <h2 class="display1 white--text">{{ get_date() }}</h2></v-col
      >
      <v-col>
        <h1 class="red--text" v-if="response_data !== ''">
          <span class="white--text">ERROR: </span>{{ response_data }}
        </h1>
      </v-col>
    </v-row>

    <div>
      <v-text-field
        @input="debouncedInsertAttendance()"
        autofocus
        dark
        label="ID Number"
        color="white"
        class="white--text"
        v-model="card_id"
      ></v-text-field>
    </div>

    <div class="mt-2">
      <v-row>
        <v-col>
          <h2 class="white--text">ATTENDANCE LIST</h2>
          <!-- AUDIO FILES -->
          <div>
            <!-- SUCCESS AUDIO -->
            <audio controls ref="successAudio" hidden>
              <source src="@/assets/success.wav" type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <!-- NOT FOUND AUDIO -->
            <audio controls ref="notFoundAudio" hidden>
              <source src="@/assets/notFound.wav" type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <!-- ALREADY LOGGED IN AUDIO -->
            <audio controls ref="alreadyLoggedAudio" hidden>
              <source src="@/assets/alreadyLogged.wav" type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <!-- EXPIRED AUDIO -->
            <audio controls ref="expiredAudio" hidden>
              <source src="@/assets/expired.wav" type="audio/wav" />
              Your browser does not support the audio element.
            </audio>

            <!-- THANK YOU AUDIO -->
            <audio controls ref="thankyouAudio" hidden>
              <source src="@/assets/thankyou.wav" type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>

          <v-data-table
            :items="attendances"
            :headers="headers"
            dark
            v-if="attendances.length > 0"
          >
            <template v-slot:item.action="{ item }">
              <div class="pa-2">
                <v-avatar size="40" color="grey darken-3">
                  <h2 v-if="!item.account.profile_picture_url">
                    {{ item.account.name.charAt(0) }}
                  </h2>

                  <v-img
                    v-else
                    :src="item.account.profile_picture_url"
                    width="100%"
                  ></v-img>
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

          <!-- 2nd TABLE -->
        </v-col>
        <v-col>
          <h2 class="white--text">TOP GYM GOERS</h2>
          <v-data-table
            :items="top_gymmers"
            :headers="top_gymmers_header"
            dark
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
        </v-col>
      </v-row>
    </div>
    <v-container class="">
      <v-dialog v-model="enable_message" width="680">
        <v-card :color="cardColor"
          ><v-card-text class="d-flex justify-center">
            <h1 class="pa-15 display-1 white--text" style="text-align: center">
              <v-icon color="white" large class="mt-n1">{{ cardIcon }}</v-icon>
              {{ message }}
            </h1>
          </v-card-text></v-card
        ></v-dialog
      >
      <p class="caption white--text mt-5 text-center">
        Developed by: Jan Michael Besinga 2024
      </p>
    </v-container>
  </v-img>
</template>

<script>
import _ from "lodash";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

// import accountNotFoundAudio from "@/assets/notFound.wav";
import CheckAccountModal from "../components/CustomerUI/CheckAccountModal.vue";
export default {
  data() {
    return {
      modalTimeOut: 3000,
      cardIcon: "mdi-check-circle",
      cardColor: "success",
      time: "",
      response_data: "",
      enable_message: false,
      message: "",
      message_color: "primary",
      card_id: "",

      headers: [
        { text: "", value: "action" },
        { text: "Name", value: "account.name" },
        { text: "Account Rank", value: "account_type" },
        { text: "Time Logged In", value: "logged_in" },
        { text: "Time Logged Out", value: "logged_out" },
        { text: "Total Time Spent", value: "total_hours" },
      ],
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
  components: {
    CheckAccountModal,
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
      get_attendances: "attendance/get_attendances",
      add_attendance: "attendance/add_attendance",
      get_top_gymmers: "account/get_top_gymmers",
    }),
    // format_gym_time(minutes) {
    //   var hours = minutes / 60;
    //   var minute = minutes % 60;
    //   var formatted_hours = hours == 1 ? hours + " hour" : hours + " hours";
    //   var formatted_minutes =
    //     minute == 1 ? minute + " minute" : minute + " minutes";

    //   // Build the final formatted string
    //   var formatted_string = formatted_hours + " and " + formatted_minutes;
    //   return formatted_string;
    // },
    insert_attendance() {
      this.add_attendance(this.card_id).then((data) => {
        // console.log(data);
        if (data[1] == "Successfully logged in") {
          this.cardColor = "success";
          this.cardIcon = "mdi-check";
          this.$refs.successAudio.play();
        } else if (
          data[1] ==
          "Thank you for choosing JC Fitness Gym. Hope you had a good time!"
        ) {
          this.modalTimeOut = 5000;
          this.cardColor = "success";
          this.cardIcon = "mdi-check";
          this.$refs.thankyouAudio.play();
          this.modalTimeOut = 3000;
        } else if (data[1] == "Account not found") {
          this.cardColor = "error";
          this.cardIcon = "mdi-alert";
          this.$refs.notFoundAudio.play();
        } else if (data[1] == "Account already logged in") {
          this.cardColor = "warning";
          this.cardIcon = "mdi-alert";
          this.$refs.alreadyLoggedAudio.play();
        } else if (data[1] == "Account Expired") {
          this.cardColor = "error";
          this.cardIcon = "mdi-alert";
          this.$refs.expiredAudio.play();
        }

        this.message_modal(data[1]);
      });
    },
    get_rank(rank) {
      if (rank == "Novice") return { color: "brown", stars: 1 };
      if (rank == "Veteran") return { color: "grey", stars: 2 };
      if (rank == "Master") return { color: "yellow ", stars: 3 };
      if (rank == "Legendary") return { color: "red", stars: 4 };
      if (rank == "Beast") return { color: "deep-orange accent-3", stars: 5 };
    },
    get_date() {
      let date = moment().format("MMMM DD, YYYY");
      return date;
    },
    clock() {
      var time = moment().format("h:m:s A");
      this.time = time;
    },
    message_modal(message) {
      this.enable_message = true;
      this.message = message;
      this.message_color = "red";
      setTimeout(() => {
        this.enable_message = false;
        this.card_id = "";
      }, this.modalTimeOut);
    },
  },
  mounted() {
    this.debouncedInsertAttendance = _.debounce(this.insert_attendance, 300);
    setInterval(this.clock, 1000);
  },
};
</script>

<style></style>
