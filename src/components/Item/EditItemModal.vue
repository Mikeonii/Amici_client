<template>
  <div>
    <v-btn color="yellow" icon @click="dialog = true">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-card-title>Edit Item</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="item.item_name"
            label="Item Name"
            prepend-icon="mdi-list-box"
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="item.unit_price"
            label="Unit Price"
            prepend-icon="mdi-cash"
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="item.selling_price"
            label="Selling Price"
            prepend-icon="mdi-cash-multiple"
          ></v-text-field>

          <v-text-field
            v-model="item.stocks"
            type="number"
            label="Stocks"
            prepend-icon="mdi-package-variant-closed"
          ></v-text-field>

          <v-select
            label="Unit"
            v-model="item.unit"
            prepend-icon="mdi-ruler"
            :items="['Pcs', 'Boxes', 'Tray']"
          ></v-select>
          <v-select
            prepend-icon="mdi-check"
            label="Item Type"
            :items="itemTypes"
            v-model="item.item_type"
          ></v-select>
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
  props: ["item"],
  data() {
    return {
      alertMessage: "",
      enableAlert: "",
      dialog: false,
      button_loading: false,
      itemTypes: [
        "Monthly Subscription",
        "Membership",
        "Membership and Monthly",
        "Item Sale",
        "Discounted Monthly Subscription",
        "Discounted Membership",
      ],
    };
  },
  methods: {
    ...mapActions({
      edit_item: "item/edit_item",
    }),
    submit() {
      this.button_loading = true;
      this.edit_item(this.item).then(() => {
        this.alertMessage = "Successfully edited an item!";
        this.enableAlert = true;
        this.button_loading = false;
      });
    },
  },
};
</script>

<style></style>
