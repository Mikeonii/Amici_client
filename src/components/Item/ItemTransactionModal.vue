<template>
  <div>
    <v-btn @click="dialog = true">Item Transactions</v-btn>
    <v-dialog v-model="dialog" width="800" persistent>
      <v-card>
        <v-card-title>Item Transactions Modal</v-card-title>
        <v-card-text>
          <!-- ITEM TRANSACTION TABLE -->
          <v-row class="mt-3">
            <v-col> <h4>Item Transactions</h4></v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end">
              <add-item-transaction :account_id="item.id" />
            </v-col>
          </v-row>
          <v-data-table
            :items="item_transactions"
            :headers="item_transactions_headers"
          >
            <template v-slot:item.created_at="{ item }">
              {{ formatted_date_time(item.created_at) }}</template
            >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <p class="caption">ItemTransactionModal.vue</p>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import moment from "moment";
import AddItemTransaction from "../Item/AddItemTransaction.vue";
import { mapGetters } from "vuex";
export default {
  props: ["item"],
  components: { AddItemTransaction },
  data() {
    return {
      dialog: false,
      button_loading: false,
      item_transactions_headers: [
        { text: "Product Name", value: "item.item_name" },
        { text: "Quantity", value: "quantity" },
        { text: "Amount", value: "amount" },
        { text: "Transaction Date", value: "created_at" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      item_transactions: "item/item_transactions",
    }),
  },
  methods: {
    submit() {
      return;
    },
    formatted_date_time(dateTime) {
      return moment(dateTime).format("MMMM D,YYYY - h:m:s A");
    },
  },
  created() {},
};
</script>

<style></style>
