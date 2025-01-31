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
            v-model="form.phone_number"
            label="Phone"
            prepend-icon="mdi-phone"
          ></v-text-field>
          <v-text-field
            v-model="form.card_no"
            label="Card Number"
            prepend-icon="mdi-card"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submit">Submit</v-btn>
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <p class="caption">addAccountModal.vue</p>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- lazy -->
    <alert-modal
      title="Alert"
      :message="alertMessage"
      v-if="enableAlert"
      @close="enableAlert = false"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  components: { alertModal: () => import("../alertModal.vue") },
  data() {
    return {
      alertMessage: "",
      enableAlert: "",
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
      this.loading = true;
      this.add_account(this.form)
        .then(() => {
          this.alertMessage = "Successfully added a new account!";
          this.enableAlert = true;
        })
        .catch((err) => {
          this.alertMessage = err;
          this.enableAlert = true;
        });
      this.loading = false;
    },
  },
};
</script>

<style></style>
