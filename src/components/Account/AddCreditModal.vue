<template>
  <div>
    <v-btn @click="dialog = true" color="primary" small>Add</v-btn>
    <v-dialog v-model="dialog" width="400" persistent>
      <v-card>
        <v-card-title>Credit Transaction</v-card-title>
        <v-card-text>
          <v-select
            label="Transaction Type"
            :items="['Add', 'Subtract', 'Transfer']"
            v-model="form.transaction_type"
          ></v-select>
          <v-text-field label="Amount" v-model="form.amount"></v-text-field>
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
import { mapActions } from "vuex";
export default {
  props: ["item_id"],
  data() {
    return {
      dialog: false,
      form: {},
      button_loading: false,
    };
  },
  methods: {
    ...mapActions({
      add_credit_transaction: "account/add_credit_transaction",
    }),
    submit() {
      let x = window.confirm("Are you sure you want to proceed?");
      if (x) {
        this.form.account_id = this.item_id;
        this.button_loading = true;
        this.add_credit_transaction(this.form)
          .then(() => {
            alert("Succesfully added a credit");
          })
          .catch((err) => {
            alert(err);
          });
        this.button_loading = false;
      }
    },
  },
};
</script>

<style></style>
