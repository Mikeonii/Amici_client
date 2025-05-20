<template>
  <div>
    <v-btn @click="dialog = true" color="primary">Users</v-btn>
    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-card-title>User Accounts</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              prepend-icon="mdi-account-circle"
              label="Name"
              v-model="form.name"
              :rules="[(v) => !!v || 'Field is required']"
            ></v-text-field>
            <v-text-field
              prepend-icon="mdi-account"
              label="Username"
              v-model="form.username"
              :rules="[(v) => !!v || 'Field is required']"
            ></v-text-field>
            <v-text-field
              prepend-icon="mdi-lock-outline"
              label="Password"
              v-model="form.password"
              :rules="[(v) => !!v || 'Field is required']"
            ></v-text-field>
            <v-btn
              @click="createAccount()"
              :loading="button_loading"
              color="primary"
              >Create Account</v-btn
            >
          </v-form>
          <br />
          <br />
          <h3>Users Table</h3>
          <v-data-table :items="users" :headers="headers"></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <p class="caption">addUserModal.vue</p>
        </v-card-actions>
        <alert-modal
          v-if="alertModal"
          :message="alertMessage"
          @close="alertModal = false"
        /> </v-card
    ></v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import alertModal from "../alertModal.vue";
import { mapGetters } from "vuex";

export default {
  components: { alertModal },
  data() {
    return {
      alertModal: false,
      alertMessage: "",
      dialog: false,
      button_loading: false,
      users: [],
      form: {
        name: "",
        username: "",
      },
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Username", value: "username" },
        { text: "Created", value: "created_at" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    submit() {
      return;
    },
    async get_users() {
      let users = await axios.get("users");
      this.users = users.data;
    },
    async createAccount() {
      if (this.user.username != "admin") {
        this.alertMessage = "You are not allowed to perform this action";
        this.alertModal = true;
        return;
      }
      this.button_loading = true;
      let user = await axios.post("user", this.form);
      this.users.push(user.data);

      this.button_loading = false;
      this.alertMessage = "Successfully added a new account";
      this.alertModal = true;
    },
  },
  created() {
    this.get_users();
    console.log(this.users);
  },
};
</script>

<style></style>
