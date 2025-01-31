<template>
  <div>
    <v-btn @click="dialog = true" class="ml-2" color="primary">Session</v-btn>
    <v-dialog v-model="dialog" width="800" persistent>
      <v-card>
        <v-card-title><p class="display-1">Session</p></v-card-title>
        <v-card-text>
          <h3>Add Session</h3>
          <v-form ref="form" @submit.prevent="add">
            <v-row>
              <v-col>
                <v-text-field
                  autofocus
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
                  ref="textField"
                  prepend-icon="mdi-pin"
                  label="Address"
                  v-model="form.address"
                ></v-text-field>
                <v-text-field
                  prepend-icon="mdi-cash"
                  label="Amount Paid"
                  v-model="form.amount_paid"
                ></v-text-field>
                <v-btn color="primary" type="submit" :loading="button_loading"
                  >Add Session</v-btn
                >
              </v-col>
            </v-row>
          </v-form>

          <v-divider class="mt-4 mb-4"></v-divider>
          <h3>Sessions Table</h3>
          <v-text-field
            label="Search "
            prepend-icon="mdi-magnify"
            v-model="search"
          ></v-text-field>
          <v-data-table
            :search="search"
            :items="sessions"
            :headers="session_headers"
          ></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <p class="caption">addSessionModal.vue</p>
        </v-card-actions></v-card
      ></v-dialog
    >
    <alert-modal
      v-if="enable_alert"
      title="Alert"
      :message="alert_message"
      @close="enable_alert = false"
    />
  </div>
</template>

<script>
import axios from "axios";
import alertModal from "./alertModal.vue";
export default {
  components: { alertModal },
  data() {
    return {
      enable_alert: false,
      form: {
        amount_paid: "100",
      },
      alert_message: "",
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
    async add(form) {
      this.button_loading = true;
      await axios.post("session", form).then((res) => {
        this.button_loading = false;

        this.enable_alert = true;
        this.alert_message = "Successfully added a session";
        this.sessions.unshift(res.data);
      });
    },
    async get_sessions() {
      let response = await axios.get("/sessions");
      this.sessions = response.data;
    },
    submit() {
      return;
    },
  },
  created() {},
};
</script>

<style></style>
