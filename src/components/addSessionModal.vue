<template>
  <div>
    <v-btn @click="dialog = true" class="ml-2" color="primary">Session</v-btn>
    <v-dialog v-model="dialog" width="800" persistent>
      <v-card>
        <v-card-title><p class="display-1">Session</p></v-card-title>
        <v-card-text>
          <h3>Add Session</h3>
          <v-row>
            <v-col>
              <v-text-field
                prepend-icon="mdi-account"
                label="Customer Name"
                v-model="form.customer_name"
              ></v-text-field>
              <v-select
                :items="['Male', 'Female']"
                label="Gender"
                v-model="form.customer_gender"
                prepend-icon="mdi-gender-male"
              ></v-select
            ></v-col>
            <v-col>
              <v-text-field
                prepend-icon="mdi-pin"
                label="Address"
                v-model="form.address"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-cash"
                label="Amount Paid"
                v-model="form.amount_paid"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn color="primary" @click="add_session">Add Session</v-btn>
          <v-divider class="mt-4 mb-4"></v-divider>
          <h3>Sessions Table</h3>
          <v-text-field
            label="Search "
            prepend-icon="mdi-magnify"
          ></v-text-field>
          <v-data-table
            :search="search"
            :items="sessions"
            :headers="session_headers"
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
import axios from "axios";
export default {
  data() {
    return {
      form: {
        amount_paid: "100",
      },

      search: "",
      dialog: false,
      button_loading: false,
      sessions: [],
      session_headers: [
        { text: "id", value: "id" },
        { text: "Customer Name", value: "customer_name" },
        { text: "Address", value: "address" },
        { text: "Date and Time", value: "created_at" },
        { text: "Amount Paid", value: "amount_paid" },
      ],
    };
  },
  methods: {
    add_session() {
      let x = window.confirm("Are you sure you want to proceed?");
      if (x) {
        this.add(this.form);
      }
    },
    async add(form) {
      let response = await axios.post("session", form);
      this.sessions.unshift(response.data);
      alert("Successfully added a session");
    },
    async get_sessions() {
      let response = await axios.get("/sessions");
      this.sessions = response.data;
    },
    submit() {
      return;
    },
  },
  created() {
    this.get_sessions();
  },
};
</script>

<style></style>
