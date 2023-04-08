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
            <input type="date" v-model="item.birth_date" class="ml-2 mt-n4" />
          </div>
          <v-text-field
            v-model="item.address"
            label="Address"
            prepend-icon="mdi-map"
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["item"],
  data() {
    return {
      dialog: false,
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      edit_account: "account/edit_account",
    }),
    submit() {
      let x = window.confirm("Are you sure you want to edit this account?");
      if (x) {
        this.loading = true;
        this.edit_account(this.item)
          .then(() => {
            alert("Successfully edited an account!");
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
