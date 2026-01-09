<template>
  <div>
    <v-btn color="primary" @click="dialog = true">Add Account</v-btn>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title> Add Account </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="validForm">
            <v-text-field
              v-model="form.name"
              label="Name"
              prepend-icon="mdi-account"
              :rules="[rules.required]"
            ></v-text-field>
            <v-select
              prepend-icon="mdi-gender-male-female"
              v-model="form.gender"
              :items="['Male', 'Female']"
              label="Gender"
              :rules="[rules.required]"
            ></v-select>
            <div class="d-flex mt-2">
              <p class="mt-3">Birthdate</p>
              <input
                type="date"
                v-model="form.birth_date"
                class="ml-2 mt-n4"
                :rules="[rules.required]"
                @input="checkAge()"
              />
              <v-text-field
                class="ml-2"
                label="Age"
                v-model="form.age"
                prepend-icon="mdi-account-circle"
                :rules="[rules.required]"
              ></v-text-field>
            </div>
            <v-text-field
              v-model="form.address"
              label="Address"
              prepend-icon="mdi-map"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="form.phone_number"
              label="Phone"
              prepend-icon="mdi-phone"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="form.card_no"
              label="Card Number"
              prepend-icon="mdi-card"
              :rules="[rules.required]"
            ></v-text-field>
          </v-form>
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
import moment from "moment";
export default {
  components: { alertModal: () => import("../alertModal.vue") },
  data() {
    return {
      alertMessage: "",
      enableAlert: "",
      dialog: false,
      form: {},
      loading: false,
      validForm: false, // To hold the validation state of the form
      rules: {
        required: (value) => !!value || "This field is required.",
      },
    };
  },
  methods: {
    ...mapActions({
      add_account: "account/add_account",
    }),

    checkAge() {
      if (this.form.birth_date) {
        const birthDate = moment(this.form.birth_date);
        const today = moment();
        this.form.age = today.diff(birthDate, "years");
      }
    },
    async submit() {
      // Validate the form
      await this.$refs.form.validate();

      if (this.validForm) {
        this.loading = true;
        try {
          await this.add_account(this.form);
          this.alertMessage = "Successfully added a new account!";
          this.enableAlert = true;
          this.dialog = false; // Optionally close dialog on success
          this.$refs.form.reset(); // Optionally reset form on success
        } catch (err) {
          this.alertMessage =
            err.response?.data?.message || err.message || "An error occurred.";
          this.enableAlert = true;
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style></style>
