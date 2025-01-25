<template>
  <v-container>
    <v-row class="mb-2">
      <v-col><h3>Sales List Table</h3></v-col>
      <v-spacer></v-spacer>
      <v-col>
        <!-- test change -->
        <daily-sales-report-modal />
      </v-col>
    </v-row>
    <v-data-table :items="sales" :headers="headers"> </v-data-table>
  </v-container>
</template>
<script>
import axios from "axios";
import dailySalesReportModal from "./dailySalesReportModal.vue";
export default {
  components: { dailySalesReportModal },
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
