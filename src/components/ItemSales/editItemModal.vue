<template>
  <div>
    <v-dialog v-model="dialog" width="300" persistent>
      <v-card>
        <v-card-title>Edit Item</v-card-title>
        <v-card-text>
          <v-text-field
            label="Item Name"
            v-model="item.item_name"
          ></v-text-field>
          <v-text-field
            label="Item Price"
            v-model="item.unit_price"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="close()">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      dialog: true,
      button_loading: false,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submit() {
      return;
    },
  },
};
</script>

<style></style>
