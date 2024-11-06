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
          <add-session-modal />
          <v-btn class="ml-2" @click="show_top_gymmer = true"
            >Top Gym Goers</v-btn
          >
          <v-btn
            class="mb-6 white--text ml-4"
            :color="show_navs ? 'purple' : 'grey'"
            @click="toggle_navs"
            >{{ show_navs == true ? "Start" : "Exit" }}</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <v-row class="mt-n10">
      <v-col>
        <p class="white--text" style="font-size: 100px">
          <span class="font-weight-black">JC FITNESS GYM</span> Mgt. System
        </p>
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
          <h2 class="white--text">Attendance List</h2>
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
          <h2 class="white--text">
            Top 10 Gym-Goers of the Month
            <!-- <span class="font-weight-light">({{ month }})</span> -->
            <span class="font-weight-light">(October)</span>
          </h2>
          <v-data-table
            :items="top_gymmers_of_current_month"
            :headers="top_gymmers_header"
            dark
            :sort-by="['attendances_count']"
            :sort-desc="[true]"
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
              <p>{{ Math.floor(item.total_gym_time / 60) }} Hours</p>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <v-container class="">
      <v-dialog v-model="enable_message" :width="modal_width">
        <v-card :color="cardColor"
          ><v-card-text class="">
            <h1 class="pa-15 display-1 white--text" style="text-align: center">
              <v-icon color="white" large class="mt-n1">{{ cardIcon }}</v-icon>
              {{ message }}

              <!-- Att Info -->
              <br />
              <v-row v-if="att_data.account.name != 'N/A'">
                <v-col cols="4">
                  <v-avatar size="250">
                    <v-img
                      v-if="att_data.account.profile_picture_url != 'n/a'"
                      :src="att_data.account.profile_picture_url"
                      width="100%"
                    ></v-img>
                    <v-img
                      v-else
                      src="@/assets/jc_logo.jpg"
                      width="100%"
                    ></v-img> </v-avatar
                ></v-col>
                <v-col>
                  <div
                    v-if="att_data.account.name != 'N/A'"
                    class="mt-8 display-2"
                    style="text-align: left"
                  >
                    <p>
                      Name: <strong>{{ att_data.account.name }}</strong>
                    </p>
                    <p>
                      Rank: <strong>{{ att_data.account.rank }}</strong>
                    </p>
                    <p>
                      Logged in: <strong>{{ att_data.logged_in }}</strong>
                    </p>
                    <p>
                      Logged out: <strong>{{ att_data.logged_out }}</strong>
                    </p>
                    <p>
                      Total Hours: <strong>{{ att_data.total_hours }}</strong>
                    </p>
                  </div></v-col
                >
              </v-row>
            </h1>
          </v-card-text></v-card
        ></v-dialog
      >
      <p class="caption white--text mt-5 text-center">
        Developed by: Jan Michael Besinga 2024
      </p>
      <!-- lazy loaded compnents -->
      <top-gymmers-modal
        v-if="show_top_gymmer"
        @close="show_top_gymmer = false"
      />
    </v-container>
  </v-img>
</template>

<script>
import _ from "lodash";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

// import accountNotFoundAudio from "@/assets/notFound.wav";
import CheckAccountModal from "../components/CustomerUI/CheckAccountModal.vue";
import AddSessionModal from "./addSessionModal.vue";
export default {
  data() {
    return {
      show_top_gymmer: false,
      modal_width: 1200,
      modalTimeOut: 10000,
      cardIcon: "mdi-check-circle",
      cardColor: "success",
      time: "",
      response_data: "",
      enable_message: false,
      message: "",
      message_color: "primary",
      card_id: "",
      att_data: {
        account: {
          name: "N/A",
          rank: "N/A",
        },
        logged_in: "N/A",
        logged_out: "N/A",
        total_hours: "N/A",
      },
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
        { text: "Total Att. Rows", value: "attendances_count" },
        { text: "Total Gym Time", value: "formatted_gym_time" },
      ],
    };
  },
  components: {
    CheckAccountModal,
    AddSessionModal,
    topGymmersModal: () => import("./topGymmersModal.vue"),
  },
  computed: {
    ...mapGetters({
      show_navs: "auth/show_navs",
      attendances: "attendance/attendances",
      top_gymmers: "account/top_gymmers",
      top_gymmers_of_current_month: "account/top_gymmers_of_current_month",
    }),
    month() {
      let month = moment().format("MMMM");
      // let year = moment().format("YYYY");
      return month;
    },
  },
  methods: {
    ...mapActions({
      toggle_navs: "auth/toggle_navs",
      get_attendances: "attendance/get_attendances",
      add_attendance: "attendance/add_attendance",
      get_top_gymmers: "account/get_top_gymmers",
      get_top_gymmers_of_current_month:
        "account/get_top_gymmers_of_current_month",
    }),
    insert_attendance() {
      this.add_attendance(this.card_id).then((data) => {
        // console.log(data);
        var empty_att_data = {
          account: {
            profile_picture_url: "N/A",
            name: "N/A",
            rank: "N/A",
          },
          logged_in: "N/A",
          logged_out: "N/A",
          total_hours: "N/A",
        };
        if (data[1] == "Successfully logged in") {
          this.modal_width = 1200;
          this.att_data = data[0];
          this.cardColor = "success";
          this.cardIcon = "mdi-check";
          this.$refs.successAudio.play();
        } else if (
          data[1] ==
          "Thank you for choosing JC Fitness Gym. Hope you had a good time!"
        ) {
          this.modal_width = 1200;
          this.att_data = data[0];
          this.modalTimeOut = 10000;
          this.cardColor = "success";
          this.cardIcon = "mdi-check";
          this.$refs.thankyouAudio.play();
          this.modalTimeOut = 10000;
        } else if (data[1] == "Account not found") {
          this.modal_width = 600;
          this.att_data = empty_att_data;
          this.cardColor = "error";
          this.cardIcon = "mdi-alert";
          this.$refs.notFoundAudio.play();
        } else if (data[1] == "Account already logged in") {
          this.modal_width = 600;
          this.att_data = empty_att_data;
          this.cardColor = "warning";
          this.cardIcon = "mdi-alert";
          this.$refs.alreadyLoggedAudio.play();
        } else if (data[1] == "Account Expired") {
          this.modal_width = 600;
          this.att_data = empty_att_data;
          this.cardColor = "error";
          this.cardIcon = "mdi-alert";
          this.$refs.expiredAudio.play();
        }

        this.message_modal(data[1], data[0]);
      });
    },
    get_rank(rank) {
      if (rank == "Novice") return { color: "brown", stars: 1 };
      if (rank == "Lifter") return { color: "blue", stars: 2 };
      if (rank == "Veteran") return { color: "grey", stars: 3 };
      if (rank == "Master") return { color: "yellow ", stars: 4 };
      if (rank == "Legendary") return { color: "red", stars: 5 };
      if (rank == "Beast") return { color: "deep-orange accent-3", stars: 6 };
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
  created() {},
  mounted() {
    this.debouncedInsertAttendance = _.debounce(this.insert_attendance, 100);
    if (this.top_gymmers_of_current_month.length <= 0)
      this.get_top_gymmers_of_current_month();
  },
};
</script>

<style></style>
