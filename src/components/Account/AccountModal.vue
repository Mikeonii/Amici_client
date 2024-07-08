<template>
  <div>
    <v-btn icon color="primary" @click="open">
      <v-icon>mdi-list-box</v-icon></v-btn
    >
    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-card-title>Account Info</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3" class="mt-1">
              <v-img src="@/assets/jc_logo.jpg" width="100%"></v-img
            ></v-col>
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
                Monthly Expiration Date:
                {{ formatted_date(item.expiry_date) }}
              </p>
              <h2>Credits: {{ item.credits }}</h2>
            </v-col>
          </v-row>
          <br />
          <div class="d-flex">
            <!-- <v-btn class="ml-2">Add Measurement</v-btn> -->
            <credit-transaction-modal :item="item" class="ml-2" />
            <item-transaction-modal :item="item" class="ml-2" />
          </div>
          <!-- MEASUREMENTS TABLE -->
          <v-row class="mt-3">
            <v-col> <h4>Body Measurement</h4></v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end">
              <add-body-measurements-modal :account_id="item.id" />
            </v-col>
          </v-row>
          <v-data-table :items="measurements" :headers="measurement_headers">
            <template v-slot:item.created_at="{ item }">
              {{ formatted_date_time(item.created_at) }}</template
            >
          </v-data-table>
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
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

import AddBodyMeasurementsModal from "./AddBodyMeasurementModal.vue";
import ItemTransactionModal from "../Item/ItemTransactionModal.vue";
import CreditTransactionModal from "../CreditTransactionModal.vue";
export default {
  components: {
    AddBodyMeasurementsModal,
    ItemTransactionModal,
    CreditTransactionModal,
  },
  props: ["item"],
  data() {
    return {
      dialog: false,

      measurement_headers: [
        {
          text: "Upper Arm",
          value: "upper_arm",
        },
        {
          text: "Forearm",
          value: "forearm",
        },
        {
          text: "Chest",
          value: "chest",
        },
        {
          text: "Thigh",
          value: "thigh",
        },
        {
          text: "Calf",
          value: "calf",
        },
        {
          text: "Waist",
          value: "waist",
        },
        {
          text: "Shoulder",
          value: "shoulder",
        },
        {
          text: "Date Measured",
          value: "created_at",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      measurements: "account/measurements",
    }),
  },

  methods: {
    async open() {
      this.dialog = true;

      await this.get_credit_transactions(this.item.id);
      await this.get_item_transactions(this.item.id);
      await this.get_measurements(this.item.id);
    },
    ...mapActions({
      get_credit_transactions: "account/get_credit_transactions",
      get_item_transactions: "item/get_item_transactions",
      get_measurements: "account/get_measurements",
    }),

    formatted_date(item) {
      let x = moment(item).format("MMMM D, YYYY");
      return x;
    },
    formatted_date_time(dateTime) {
      return moment(dateTime).format("MMMM D,YYYY - h:m:s A");
    },
    get_rank(rank) {
      if (rank == "Minotaur") return { color: "brown", stars: 1 };
      if (rank == "Pegasus") return { color: "grey", stars: 2 };
      if (rank == "Phoenix") return { color: "yellow ", stars: 3 };
      if (rank == "Cerberus") return { color: "red", stars: 4 };
      if (rank == "Dragon") return { color: "deep-orange accent-3", stars: 5 };
    },
  },
};
</script>

<style></style>
