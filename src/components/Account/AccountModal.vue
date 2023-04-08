<template>
  <div>
    <v-btn icon color="primary" @click="dialog = true">
      <v-icon>mdi-list-box</v-icon></v-btn
    >
    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-card-title>Account Info</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3" class="mt-1">
              <v-img src="@/assets/logo.png" width="100%"></v-img
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
                Account Expiration Date:
                {{ formatted_date(item.created_at) }}
              </p>
              <h2>Credits: {{ item.credits }}</h2>
            </v-col>
          </v-row>
          <br />
          <!-- MEASUREMENTS TABLE -->
          <h4>Body Measurements</h4>
          <v-data-table
            :items="measurement"
            :headers="measurement_headers"
          ></v-data-table>
          <!-- CREDIT TRANSACTION TABLE -->
          <h4>Credit Transactions</h4>
          <v-data-table
            :items="credit_transactions"
            :headers="credit_transactions_headers"
          ></v-data-table>
          <!-- ITEM TRANSACTION TABLE -->
          <h4>Item Transactions</h4>
          <v-data-table
            :items="item_transactions"
            :headers="item_transactions_headers"
          ></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  props: ["item"],
  data() {
    return {
      dialog: false,
      item_transactions_headers: [
        { text: "Product Name", value: "product_name" },
        { text: "Quantity", value: "quantity" },
        { text: "Amount", value: "amount" },
        { text: "Transaction Date", value: "created_at" },
      ],
      credit_transactions_headers: [
        { text: "Transaction Type", value: "transaction_type" },
        { text: "Amount", value: "amount" },
        { text: "Transaction Date", value: "created_at" },
      ],
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
      measurement: "account/measurement",
    }),
  },
  methods: {
    formatted_date(item) {
      let x = moment(item).format("MMMM D, YYYY");
      return x;
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
