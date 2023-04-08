<template>
  <div>
    <v-btn color="primary" @click="dialog = true">Add Account</v-btn>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title> Add Account </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Name"
            prepend-icon="mdi-account"
          ></v-text-field>
          <v-select
            prepend-icon="mdi-gender-male-female"
            v-model="form.gender"
            :items="['Male', 'Female']"
            label="Gender"
          ></v-select>
          <div class="d-flex mt-2">
            <p>Birthdate</p>
            <input type="date" v-model="form.birth_date" class="ml-2 mt-n4" />
          </div>
          <v-text-field
            v-model="form.address"
            label="Address"
            prepend-icon="mdi-map"
          ></v-text-field>

          <v-text-field
            v-model="form.card_no"
            label="Card Number"
            prepend-icon="mdi-card"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submit">Submit</v-btn>
          <v-btn @click="dialog = false">Close</v-btn></v-card-actions
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      form: {},
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      add_account: "account/add_account",
    }),
    submit() {
      let x = window.confirm("Are you sure you want to add this account?");
      if (x) {
        this.loading = true;
        this.add_account(this.form)
          .then(() => {
            alert("Successfully added a new account!");
          })
          .catch((err) => {
            alert(err);
          });
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
