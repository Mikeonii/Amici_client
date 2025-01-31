<template>
  <div>
    <v-btn color="primary" small @click="dialog = true">Add</v-btn>
    <v-dialog v-model="dialog" width="400" persistent>
      <v-card>
        <v-card-title>Add Body Measurement</v-card-title>
        <v-card-text>
          <p>Measured by Inches and Centimeters</p>
          <v-text-field
            label="Upper Arm"
            v-model="form.upper_arm"
          ></v-text-field>
          <v-text-field
            type="number"
            label="Forearm"
            v-model="form.forearm"
          ></v-text-field>
          <v-text-field
            type="number"
            label="Chest"
            v-model="form.chest"
          ></v-text-field>
          <v-text-field
            type="number"
            label="Thigh"
            v-model="form.thigh"
          ></v-text-field>
          <v-text-field
            type="number"
            label="Calf"
            v-model="form.calf"
          ></v-text-field>
          <v-text-field
            type="number"
            label="Waist"
            v-model="form.waist"
          ></v-text-field>
          <v-text-field
            type="number"
            label="Shoulder"
            v-model="form.shoulder"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
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
  props: ["account_id"],
  data() {
    return {
      alertMessage: "",
      enableAlert: "",
      form: {},
      dialog: false,
      button_loading: false,
    };
  },
  methods: {
    ...mapActions({
      add_measurement: "account/add_measurement",
    }),

    submit() {
      this.form.account_id = this.account_id;
      this.button_loading = true;
      this.add_measurement(this.form)
        .then(() => {
          this.alertMessage = "Successfully added a measurement";
          this.enableAlert = true;
          this.button_loading = false;
        })
        .catch((err) => {
          this.alertMessage = err;
          this.enableAlert = true;

          this.button_loading = false;
        });
    },
  },
};
</script>

<style></style>
