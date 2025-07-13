<template>
  <div>
    <v-btn @click="dialog = true" class="ml-2" :color="app_settings.app_color"
      >Session</v-btn
    >
    <v-dialog v-model="dialog" width="1000" persistent>
      <v-card>
        <v-card-title><p class="display-1">Walk-in Session</p></v-card-title>
        <v-card-text>
          <div v-if="searchResults.length > 0">
            <h3>Search Results</h3>
            <br />
            <v-data-table dense :items="searchResults" :headers="searchHeaders">
              <template v-slot:item.action="{ item }">
                <v-btn small color="yellow" @click="selectSearch(item)"
                  >Select</v-btn
                >
              </template>
            </v-data-table>
          </div>

          <h3>Add Session</h3>
          <v-form ref="form" @submit.prevent="add">
            <v-row>
              <v-col>
                <p class="primary--text text-center" v-if="searchLoading">
                  Loading names...
                </p>
                <v-text-field
                  autofocus
                  prepend-icon="mdi-account"
                  label="Customer Name"
                  v-model="form.customer_name"
                  @input="searchCustomer()"
                ></v-text-field>

                <v-select
                  :items="['Male', 'Female']"
                  label="Gender"
                  v-model="form.customer_gender"
                  prepend-icon="mdi-gender-male"
                ></v-select>
                <v-text-field
                  prepend-icon="mdi-cash"
                  label="Amount Paid"
                  v-model="form.amount_paid"
                ></v-text-field
              ></v-col>
              <v-col>
                <v-text-field
                  ref="textField"
                  prepend-icon="mdi-pin"
                  label="Address"
                  v-model="form.address"
                ></v-text-field>
                <v-text-field
                  prepend-icon="mdi-account-circle"
                  label="Age"
                  v-model="form.age"
                ></v-text-field>
                <v-select
                  prepend-icon="mdi-cash"
                  label="Payment Method"
                  :items="['Cash', 'Gcash']"
                  v-model="form.payment_method"
                ></v-select>
                <v-btn color="primary" type="submit" :loading="button_loading"
                  >Add Session</v-btn
                >
              </v-col>
            </v-row>
          </v-form>

          <v-divider class="mt-4 mb-4"></v-divider>
          <div class="d-flex">
            <h3>Sessions Table</h3>
            <v-spacer></v-spacer>
            <div class="d-flex">
              <v-select
                label="month"
                v-model="month"
                prepend-icon="mdi-calendar"
                :items="months"
                item-text="name"
                item-value="id"
              ></v-select>
              <v-select
                label="year"
                v-model="year"
                prepend-icon="mdi-calendar"
                :items="years"
              ></v-select>
              <v-btn @click="get_sessions_by_date" :loading="button_loading"
                >Search</v-btn
              >
            </div>
          </div>
          <v-text-field
            label="Search "
            prepend-icon="mdi-magnify"
            v-model="search"
          ></v-text-field>
          <v-data-table
            :search="search"
            :items="sessions"
            :headers="session_headers"
          >
            <template v-slot:item.action="{ item }">
              <v-btn icon color="red" @click="delete_session(item)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </template>
          </v-data-table>
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
import { mapGetters } from "vuex";
export default {
  components: { alertModal },
  data() {
    return {
      months: [
        { id: 1, name: "January" },
        { id: 2, name: "February" },
        { id: 3, name: "March" },
        { id: 4, name: "April" },
        { id: 5, name: "May" },
        { id: 6, name: "June" },
        { id: 7, name: "July" },
        { id: 8, name: "August" },
        { id: 9, name: "September" },
        { id: 10, name: "October" },
        { id: 11, name: "November" },
        { id: 12, name: "December" },
      ],

      years: [2025, 2026, 2027],
      month: "",
      year: "",
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
        { text: "Action", value: "action" },
        { text: "id", value: "id" },
        { text: "Customer Name", value: "customer_name" },
        { text: "Address", value: "address" },
        { text: "Age", value: "age" },
        { text: "Gender", value: "customer_gender" },
        { text: "Date and Time", value: "created_at" },
        { text: "Amount Paid", value: "amount_paid" },
        { text: "Payment Method", value: "payment_method" },
        { text: "Posted By", value: "posted_by" },
      ],
      searchHeaders: [
        { text: "Action", value: "action" },
        { text: "id", value: "id" },
        { text: "Customer Name", value: "customer_name" },
        { text: "Address", value: "address" },
        { text: "Age", value: "age" },
        { text: "Gender", value: "customer_gender" },
      ],
      searchLoading: false,
      searchDebounce: null,
      searchResults: [],
    };
  },
  computed: {
    ...mapGetters({
      app_settings: "auth/app_settings",
      user: "auth/user",
    }),
  },
  methods: {
    selectSearch(item) {
      this.form.customer_name = item.customer_name;
      this.form.address = item.address;
      this.form.age = item.age;
      this.form.customer_gender = item.customer_gender;
    },
    async searchCustomer() {
      this.searchLoading = true;
      // Clear the previous debounce timeout if it exists
      if (this.searchDebounce) {
        clearTimeout(this.searchDebounce);
      }

      // Set a new timeout
      this.searchDebounce = setTimeout(async () => {
        // search for a customer name in sessions table using like
        let response = await axios.get(
          `/sessions/search/${this.form.customer_name}`
        );
        this.searchResults = response.data;
        this.searchLoading = false;
      }, 1300); // 2000 milliseconds = 2 seconds
    },
    async delete_session(item) {
      if (this.user.username != "admin") {
        this.alert_message = "You are not allowed to perform this action";
        this.enable_alert = true;
        return;
      }
      await axios.delete("/session/" + item.id);
      this.get_sessions();
      this.alert_message = "Successfully deleted a session";
      this.enable_alert = true;
    },

    async add() {
      this.button_loading = true;

      await axios.post("session", this.form).then((res) => {
        this.button_loading = false;
        this.form.customer_gender = "";
        this.form.address = "";
        this.form.customer_name = "";
        this.enable_alert = true;
        this.alert_message = "Successfully added a session";
        this.sessions.unshift(res.data);
      });
    },
    async get_sessions() {
      let response = await axios.get("/sessions");
      this.sessions = response.data;
    },
    async get_sessions_by_date() {
      let month = this.month;
      let year = this.year;
      let response = await axios.get(`/sessions/byDate/${month}/${year}`);
      this.sessions = response.data;
    },

    submit() {
      return;
    },
  },
  created() {
    this.get_sessions();
    this.form.amount_paid = this.app_settings.walkInSession;
  },
};
</script>

<style></style>
