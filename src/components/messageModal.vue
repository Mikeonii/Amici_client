<template>
  <v-dialog v-model="enable_message" :width="modal_info.modal_width">
    <v-card :color="modal_info.card_color"
      ><v-card-text class="">
        <h1 class="pa-15 display-1 white--text" style="text-align: center">
          <v-icon color="white" large class="mt-n1">{{
            modal_info.card_icon
          }}</v-icon>
          {{ message }}

          <!-- Att Info -->
          <br />
          <!-- only show if there is att_data -->
          <v-row v-if="att_data">
            <!-- AVATAR -->
            <v-col cols="4">
              <v-img
                :src="require(`@/assets/${app_settings.app_logo}`)"
                size="200"
                color="grey darken-3"
                v-if="
                  att_data.account.profile_picture_url == 'n/a' ||
                  att_data.account.profile_picture_url == null
                "
              >
              </v-img>
              <v-img
                v-else
                :src="att_data.account.profile_picture_url"
                width="100%"
              >
              </v-img>
            </v-col>
            <!-- TEXT INFO -->
            <v-col>
              <div class="mt-8 display-2" style="text-align: left">
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
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      app_settings: "auth/app_settings",
    }),
  },
  props: {
    message: {
      type: String,
      default: "N/A",
    },
    att_data: {
      type: Object,
      default: () => [],
    },
    modal_info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      enable_message: true,
    };
  },
  methods: {
    submit() {
      return;
    },
  },
};
</script>

<style></style>
