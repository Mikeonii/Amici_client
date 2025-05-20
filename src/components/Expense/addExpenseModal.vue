<template>
  <div>
    <v-btn @click="dialog = true" color="warning">Expenses</v-btn>
    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-card-title>Expenses</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              prepend-icon="mdi-account-circle"
              label="Particulars"
              v-model="form.particulars"
              :rules="[(v) => !!v || 'Field is required']"
            ></v-text-field>
            <v-text-field
              type="number"
              prepend-icon="mdi-cash"
              label="Amount"
              v-model="form.amount"
              :rules="[(v) => !!v || 'Field is required']"
            ></v-text-field>

            <v-select
              prepend-icon="mdi-list-box"
              label="Category"
              :items="[
                'Gym Equipments',
                'Repair and Maintenance',
                'Salary',
                'Others',
              ]"
              v-model="form.category"
              :rules="[(v) => !!v || 'Field is required']"
            ></v-select>
            <v-btn
              @click="add_expense()"
              :loading="button_loading"
              color="primary"
              >Add Expense</v-btn
            >
          </v-form>
          <br />
          <br />
          <h2>Expenses Table</h2>
          <v-data-table :items="expenses" :headers="headers"></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="dialog = false">Close</v-btn>
          <!-- lazy -->
          <alert-modal
            title="Alert"
            :message="alertMessage"
            v-if="enableAlert"
            @close="enableAlert = false"
          /> </v-card-actions></v-card
    ></v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import alertModal from "../alertModal.vue";
export default {
  components: { alertModal },
  data() {
    return {
      enableAlert: false,
      alertMessage: "",
      dialog: false,
      button_loading: false,
      form: {},
      headers: [
        { text: "ID", value: "id" },
        { text: "Particulars", value: "particulars" },
        { text: "Amount", value: "amount" },
        { text: "Category", value: "category" },
        { text: "Posted by", value: "posted_by" },
      ],
      expenses: [],
    };
  },
  methods: {
    submit() {
      return;
    },
    async get_expenses() {
      let expenses = await axios.get("expenses");
      this.expenses = expenses.data;
    },
    async add_expense() {
      this.button_loading = true;
      let expense = await axios.post("expense", this.form);
      this.expenses.push(expense.data);
      this.button_loading = false;
      this.alertMessage = "Successfully added an expense";
      this.enableAlert = true;
    },
  },
  created() {
    this.get_expenses();
  },
};
</script>

<style></style>
