<template>
  <v-img
    :src="require(`@/assets/${this.app_settings.app_bg}`)"
    width=""
    height="%"
    class="pa-9"
  >
    <div class="d-flex">
      <v-avatar size="62">
        <img :src="require(`@/assets/${this.app_settings.app_logo}`)" />
      </v-avatar>
      <v-row class="ml-2">
        <v-col>
          <h3 :class="`${this.app_settings.app_color}--text mt-2`">
            {{ app_settings.app_name }}
          </h3>
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
            >Top Gym-Goers</v-btn
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
          <span class="font-weight-black">{{ app_settings.app_name }}</span>
          Mgt. System
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
        ref="textField"
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
              <source
                :src="
                  require(`@/assets/${this.app_settings.app_audio_folder}/success.mp3`)
                "
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>
            <!-- NOT FOUND AUDIO -->
            <audio controls ref="notFoundAudio" hidden>
              <source
                :src="
                  require(`@/assets/${this.app_settings.app_audio_folder}/notFound.mp3`)
                "
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>
            <!-- ALREADY LOGGED IN AUDIO -->
            <audio controls ref="alreadyLoggedAudio" hidden>
              <source
                :src="
                  require(`@/assets/${this.app_settings.app_audio_folder}/alreadyLogged.mp3`)
                "
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>
            <!-- EXPIRED AUDIO -->
            <audio controls ref="expiredAudio" hidden>
              <source
                :src="
                  require(`@/assets/${this.app_settings.app_audio_folder}/expired.mp3`)
                "
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>
            <!-- THANK YOU AUDIO -->
            <audio controls ref="thankyouAudio" hidden>
              <source
                :src="
                  require(`@/assets/${this.app_settings.app_audio_folder}/thankyou.mp3`)
                "
                type="audio/mp3"
              />
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
                  <h2
                    v-if="
                      item.account.profile_picture_url == null ||
                      item.account.profile_picture_url == 'n/a'
                    "
                    class="white--text"
                  >
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
            <span class="font-weight-light">({{ month }})</span>
            <!-- <span class="font-weight-light">(October)</span> -->
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
                  <h2
                    v-if="
                      item.account.profile_picture_url == null ||
                      item.account.profile_picture_url == 'n/a'
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
        </v-col>
      </v-row>
    </div>
    <v-container class="">
      <p class="caption white--text mt-5 text-center">
        Developed by: Jan Michael Besinga 2024
      </p>
      <!-- lazy loaded compnents -->
      <top-gymmers-modal
        v-if="show_top_gymmer"
        @close="show_top_gymmer = false"
      />
      <message-modal
        v-if="enable_message_modal"
        :message="message"
        :att_data="att_data"
        :modal_info="modal_info"
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
      att_data: [],
      modal_info: {},
      response_data: "",
      enable_message_modal: false,
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
        { text: "Total Att. Rows", value: "attendances_count" },
        { text: "Total Gym Time", value: "formatted_gym_time" },
      ],
    };
  },
  components: {
    CheckAccountModal,
    AddSessionModal,
    topGymmersModal: () => import("./topGymmersModal.vue"),
    messageModal: () => import("./messageModal.vue"),
  },
  computed: {
    ...mapGetters({
      app_settings: "auth/app_settings",
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
      get_top_gymmers_of_the_month: "account/get_top_gymmers_of_the_month",
    }),
    insert_attendance() {
      this.add_attendance(this.card_id).then((data) => {
        console.log("attendance data", data);
        var att_data = data[0];
        var message = data[1];
        var success_modal_time_out = 10000;
        var error_modal_time_out = 2000;
        // this will be passed as props in messageModal.vue
        var modal_info = {
          modal_width: 0,
          card_color: "",
          card_icon: "",
        };
        // set variables and values
        // var empty_att_data = {
        //   account: {
        //     profile_picture_url: "N/A",
        //     name: "N/A",
        //     rank: "N/A",
        //   },
        //   logged_in: "N/A",
        //   logged_out: "N/A",
        //   total_hours: "N/A",
        // };
        if (message == "Successfully logged in") {
          modal_info.modal_width = 1200;
          modal_info.card_color = "success";
          modal_info.card_icon = "mdi-check";
          this.modal_time_out = success_modal_time_out;
          this.$refs.successAudio.play();
        } else if (message == "Thank you for coming in") {
          modal_info.modal_width = 1200;
          modal_info.modal_time_out = 10000;
          modal_info.card_color = "success";
          modal_info.card_icon = "mdi-check";
          this.modal_time_out = success_modal_time_out;
          this.$refs.thankyouAudio.play();
        } else if (message == "Account not found") {
          modal_info.modal_width = 600;
          modal_info.card_color = "error";
          modal_info.card_icon = "mdi-alert";
          this.modal_time_out = error_modal_time_out;
          this.$refs.notFoundAudio.play();
        } else if (message == "Account already logged in") {
          modal_info.modal_width = 600;
          modal_info.card_color = "warning";
          modal_info.card_icon = "mdi-alert";
          this.modal_time_out = error_modal_time_out;
          this.$refs.alreadyLoggedAudio.play();
        } else if (message == "Account Expired") {
          modal_info.modal_width = 600;
          modal_info.card_color = "error";
          modal_info.card_icon = "mdi-alert";
          this.modal_time_out = error_modal_time_out;
          this.$refs.expiredAudio.play();
        }
        // trigger message modal
        this.message_modal(att_data, message, modal_info);
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

    message_modal(att_data, message, modal_info) {
      this.enable_message_modal = true;
      this.message = message;
      this.att_data = att_data;
      this.modal_info = modal_info;

      setTimeout(() => {
        this.enable_message_modal = false;
        this.card_id = "";
        // Re-focus the text field
        this.$nextTick(() => {
          this.$refs.textField.focus();
        });
      }, this.modal_time_out);
    },
  },
  created() {
    var current_month = moment().month();
    var current_year = moment().year();
    var date = {
      month: current_month + 1,
      year: current_year,
    };

    if (this.top_gymmers_of_current_month.length <= 0)
      this.get_top_gymmers_of_the_month(date);
  },
  mounted() {
    this.debouncedInsertAttendance = _.debounce(this.insert_attendance, 100);
  },
};
</script>

<style></style>
