<template>
  <div>
    <v-btn color="primary" @click="dialog = true">Add Item</v-btn>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title> Add Item </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.item_name"
            label="Item Name"
            prepend-icon="mdi-list-box"
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="form.unit_price"
            label="Unit Price"
            prepend-icon="mdi-cash"
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="form.selling_price"
            label="Selling Price"
            prepend-icon="mdi-cash-multiple"
          ></v-text-field>

          <v-text-field
            v-model="form.stocks"
            type="number"
            label="Stocks"
            prepend-icon="mdi-package-variant-closed"
          ></v-text-field>

          <v-select
            label="Unit"
            v-model="form.unit"
            prepend-icon="mdi-ruler"
            :items="['Pcs', 'Boxes', 'Tray']"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submit" :loading="loading"
            >Submit</v-btn
          >
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
      add_item: "item/add_item",
    }),
    submit() {
      this.loading = true;
      this.add_item(this.form)
        .then(() => {
          this.alertMessage = "Successfully added an item";
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
