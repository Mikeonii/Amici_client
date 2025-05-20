<template>
  <div>
    <v-btn @click="open()" icon><v-icon>mdi-draw-pen</v-icon></v-btn>
    <v-dialog v-model="dialog" width="650" persistent>
      <v-card>
        <v-card-title>Modify Expiration Dates</v-card-title>
        <v-card-text>
          <div class="d-flex"></div>
          <v-simple-table>
            <thead>
              <tr>
                <td>Account Name:</td>
                <td>Card Number:</td>
                <td>Monthly Expiry Date:</td>
                <td>Yearly Expiry Date:</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.card_no }}</td>
                <td>{{ item.expiry_date }}</td>
                <td>{{ item.yearly_expiry_date }}</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-radio-group row v-model="form.operation">
            <v-radio label="Add" value="add"></v-radio>
            <v-radio label="Subtract" value="subtract"></v-radio>
          </v-radio-group>
          <div class="d-flex">
            <!-- <p>Column:</p> -->
            <v-select
              label="Column"
              :items="['Monthly Expiration', 'Yearly Expiration']"
              v-model="form.column"
            >
            </v-select>

            <v-text-field
              type="number"
              label="Count"
              class="ml-2"
              v-model="form.count"
            ></v-text-field>
            <v-select
              class="ml-2"
              label="Time Intervals"
              :items="['Days', 'Weeks', 'Months', 'Years']"
              v-model="form.time_intervals"
            >
            </v-select>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <p class="caption">modifyExpirationModal.vue</p>
        </v-card-actions></v-card
      ></v-dialog
    >
    <!-- lazy components -->
    <security-modal
      v-if="enable_security"
      @passed="open_dialog"
      @close="enable_security = false"
    />
    <!-- lazy -->
    <alert-modal
      title="Alert"
      :message="alertMessage"
      v-if="alertModal"
      @close="alertModal = false"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    securityModal: () => import("../securityModal.vue"),
    alertModal: () => import("../alertModal.vue"),
  },
  props: ["item"],
  data() {
    return {
      alertMessage: "",
      alertModal: false,

      enable_security: false,
      form: {
        id: "",
        column: "",
        count: "",
        time_intervals: "",
      },

      dialog: false,
      button_loading: false,
    };
  },
  methods: {
    open_dialog() {
      this.enable_security = false;
      this.dialog = true;
    },
    open() {
      this.enable_security = true;
    },
    submit() {
      if (this.user.username != "admin") {
        this.alertMessage = "You are not allowed to perform this action";
        this.alertModal = true;
        return;
      }
      this.form.id = this.item.id;

      this.modify_expiry_dates(this.form)
        .then(() => {
          this.alertMessage = "Success";
          this.enableAlert = true;
        })
        .catch((err) => {
          this.alertMessage = err;
          this.enableAlert = true;
        });
    },
    ...mapActions({
      modify_expiry_dates: "account/modify_expiry_dates",
    }),
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
};
</script>

<style></style>
