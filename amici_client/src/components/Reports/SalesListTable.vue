<template>
  <v-container>
    <h3>Sales List Table</h3>
    <v-data-table :items="sales" :headers="headers"> </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
// import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      sales: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "account.name" },
        { text: "Item Name", value: "item.item_name" },
        { text: "Quantity", value: "quantity" },
        { text: "Amount", value: "amount" },
        { text: "Date", value: "created_at" },
      ],
    };
  },
  computed: {},
  methods: {},
  async mounted() {
    //    get all credit transact
    let response = await axios.get("/get_all_item_transactions");
    this.sales = response.data;
  },
};
</script>

<style></style>
