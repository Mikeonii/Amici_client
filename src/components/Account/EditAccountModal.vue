<template>
  <div>
    <v-btn icon color="yellow" @click="dialog = true"
      ><v-icon>mdi-pencil</v-icon></v-btn
    >
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title> Edit Account </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="item.name"
            label="Name"
            prepend-icon="mdi-account"
          ></v-text-field>
          <v-select
            prepend-icon="mdi-gender-male-female"
            v-model="item.gender"
            :items="['Male', 'Female']"
            label="Gender"
          ></v-select>
          <div class="d-flex mt-2">
            <p>Birthdate</p>
            <input type="date" v-model="item.birth_date" class="ml-2 mt-n" />
          </div>
          <v-text-field
            v-model="item.address"
            label="Address"
            prepend-icon="mdi-map"
          ></v-text-field>
          <v-text-field
            v-model="item.phone_number"
            label="Phone"
            prepend-icon="mdi-phone"
          ></v-text-field>
          <v-text-field
            v-model="item.card_no"
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
  props: ["item"],
  data() {
    return {
      alertMessage: "",
      enableAlert: "",
      dialog: false,
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      edit_account: "account/edit_account",
    }),
    submit() {
      this.loading = true;
      this.edit_account(this.item)
        .then(() => {
          this.alertMessage = "Successfully edited an account!";
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
