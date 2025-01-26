<template>
  <div>
    <v-btn color="blue" small class="white--text" @click="dialog = true"
      >Credit Transactions</v-btn
    >
    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-card-title
          ><h4>Credit Transactions</h4>

          <v-spacer></v-spacer>
          <add-credit-modal :item_id="item.id"
        /></v-card-title>
        <v-card-text>
          <!-- CREDIT TRANSACTION TABLE -->
          <v-data-table
            :items="credit_transactions"
            :headers="credit_transactions_headers"
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
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import moment from "moment";
import AddCreditModal from "./Account/AddCreditModal.vue";
import { mapGetters } from "vuex";

export default {
  props: ["item"],
  components: {
    AddCreditModal,
  },
  data() {
    return {
      dialog: false,
      button_loading: false,

      credit_transactions_headers: [
        { text: "ID", value: "id" },
        { text: "Transaction Type", value: "transaction_type" },
        { text: "Amount", value: "amount" },
        { text: "Transaction Date", value: "created_at" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      credit_transactions: "account/credit_transactions",
    }),
  },

  methods: {
    formatted_date_time(dateTime) {
      return moment(dateTime).format("MMMM D,YYYY - h:m:s A");
    },
    submit() {
      return;
    },
  },
};
</script>

<style></style>
