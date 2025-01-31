<template>
  <div>
    <v-btn icon color="primary" @click="open">
      <v-icon>mdi-account</v-icon></v-btn
    >
    <v-dialog v-model="dialog" width="850" persistent>
      <v-card>
        <v-card-title>Account Info</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4" class="mt-1">
              <file-uploader :item="item" />
            </v-col>
            <v-col cols="">
              <div class="d-flex">
                <h2 class="display-2 font-weight-black">{{ item.name }}</h2>
                <v-btn text :color="get_rank(item.rank).color" large
                  >{{ item.rank }}
                  <v-icon v-for="i in get_rank(item.rank).stars" :key="i">
                    mdi-star
                  </v-icon>
                </v-btn>
              </div>

              <v-divider class="mt-2 mb-2"></v-divider>
              <p class="subtitle-2 font-weight-bold">
                Birthdate: {{ item.birth_date }}
              </p>
              <p class="mt-n4 subtitle-2 font-weight-bold">
                Address: {{ item.address }}
              </p>
              <p class="mt-n4 subtitle-2 font-weight-bold">
                Gender: {{ item.gender }}
              </p>
              <p class="mt-n4 subtitle-2 font-weight-bold">
                Creation Date:
                {{ formatted_date(item.created_at) }}
              </p>
              <p class="mt-n4 subtitle-2 font-weight-bold">
                Monthly Expiration Date:
                {{ formatted_date(item.expiry_date) }}
              </p>
              <p class="mt-n4 subtitle-2 font-weight-bold">
                Annual Membership Expiration Date:
                {{ formatted_date(item.yearly_expiry_date) }}
              </p>
              <div class="d-flex">
                <h2>
                  <v-icon>mdi-bitcoin</v-icon>Credits:
                  <span class="orange--text"> {{ item.credits }}</span>
                </h2>
                <h2 class="ml-5">
                  <v-icon>mdi-clock-outline</v-icon> Total Gym Time:
                  <span class="green--text">
                    {{ item.total_gym_time }} minutes</span
                  >
                </h2>
              </div>
              <div class="d-flex mt-4">
                <!-- <v-btn class="ml-2">Add Measurement</v-btn> -->
                <credit-transaction-modal :item="item" class="ml-2" />
                <item-transaction-modal :item="item" class="ml-2" />
              </div>
            </v-col>
          </v-row>
          <br />

          <body-measurement :item="item" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <p class="caption">AccountModal.vue</p>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

import ItemTransactionModal from "../Item/ItemTransactionModal.vue";
import CreditTransactionModal from "../CreditTransactionModal.vue";
import BodyMeasurement from "./BodyMeasurement.vue";
import FileUploader from "../fileUploader.vue";
export default {
  components: {
    ItemTransactionModal,
    CreditTransactionModal,
    BodyMeasurement,
    FileUploader,
  },
  props: ["item"],
  data() {
    return {
      dialog: false,
      picture: null,
      picture_url: null,
      uploading: false,
    };
  },
  computed: {
    ...mapGetters({
      app_settings: "auth/app_settings",
    }),
  },

  methods: {
    async open() {
      this.dialog = true;

      await this.get_credit_transactions(this.item.id);
      await this.get_item_transactions(this.item.id);
    },
    ...mapActions({
      get_credit_transactions: "account/get_credit_transactions",
      get_item_transactions: "item/get_item_transactions",

      upload_body_improvement_picture:
        "account/upload_body_improvement_picture",
    }),

    formatted_date(item) {
      let x = moment(item).format("MMMM D, YYYY");
      return x;
    },
    formatted_date_time(dateTime) {
      return moment(dateTime).format("MMMM D,YYYY - h:m:s A");
    },
    get_rank(rank) {
      if (rank == "Novice") return { color: "brown", stars: 1 };
      if (rank == "Lifter") return { color: "blue", stars: 2 };
      if (rank == "Veteran") return { color: "grey", stars: 3 };
      if (rank == "Master") return { color: "yellow ", stars: 4 };
      if (rank == "Legendary") return { color: "red", stars: 5 };
      if (rank == "Beast") return { color: "deep-orange accent-3", stars: 6 };
    },
  },
};
</script>

<style></style>
