<template>
  <div>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title>Edit Subscription</v-card-title>
        <v-card-text>
          <p class="green--text">{{ item.account.name }}</p>
          <v-select
            label="Subscription Type"
            v-model="item.item_id"
            :items="items"
            item-text="item_name"
            item-value="id"
          ></v-select>
          <v-select
            label="Payment Method"
            v-model="item.payment_method"
            :items="payment_methods"
          ></v-select>
          <v-text-field label="Amount" v-model="item.amount"></v-text-field>
          <v-text-field label="Quantity" v-model="item.quantity"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="close()">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["item"],
  data() {
    return {
      dialog: true,
      button_loading: false,
      payment_methods: ["Gcash", "Cash"],
      items: [],
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async submit() {
      await axios.put("/item_transaction", this.item);
      this.$emit("close");
    },
    async getItems() {
      let response = await axios.get("/items");
      this.items = response.data;
      console.log(response.data);
    },
  },
  created() {
    this.getItems();
  },
};
</script>

<style></style>
