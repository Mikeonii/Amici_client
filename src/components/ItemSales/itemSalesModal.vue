<template>
  <div>
    <v-btn @click="dialog = true">Item Sales</v-btn>
    <v-dialog v-model="dialog" width="1200" persistent>
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text class="ma-5">
          <v-row>
            <v-col>
              <v-card>
                <v-card-title>Add Transaction</v-card-title>
                <v-card-text>
                  <v-text-field
                    prepend-icon="mdi-search"
                    v-model="itemSearch"
                    label="Search Item"
                  ></v-text-field>
                  <v-data-table
                    :items-per-page="3"
                    :search="itemSearch"
                    :items="items"
                    :headers="itemHeaders"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn color="success" @click="addTransaction(item)" icon
                        ><v-icon>mdi-cart-plus</v-icon></v-btn
                      >
                      <v-btn icon color="warning" @click="edit(item)"
                        ><v-icon>mdi-pencil</v-icon></v-btn
                      >
                      <v-btn icon color="error"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-card-title>Add New Item</v-card-title>
                <v-card-text>
                  <v-text-field
                    label="Item Name"
                    v-model="addItemForm.item_name"
                  ></v-text-field>
                  <v-text-field
                    type="number"
                    label="Item Price"
                    v-model="addItemForm.unit_price"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="addItem()" color="primary" :loading="loading"
                    >Add Item</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
    <edit-item-modal
      v-if="editModal"
      :item="editItem"
      @close="editModal = false"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {
    editItemModal: () => import("./editItemModal.vue"),
  },
  data() {
    return {
      editItem: {},
      editModal: false,
      itemSearch: "",
      dialog: false,
      button_loading: false,
      addItemForm: {},
      addTransactionForm: {},
      items: [],
      itemHeaders: [
        { text: "Actions", value: "actions" },

        { text: "Id", value: "id" },
        { text: "Item Name", value: "item_name" },
        { text: "Unit Price", value: "unit_price" },
      ],
      loading: false,
    };
  },
  methods: {
    edit(item) {
      this.editItem = item;
      this.editModal = true;
    },
    async getItems() {
      let response = await axios.get("/item_sales");
      this.items = response.data;
    },
    async addItem() {
      this.loading = true;
      let response = await axios.post("/item_sale", this.addItemForm);

      this.items.push(response.data);
      this.loading = false;
    },
    submit() {
      return;
    },
  },
  created() {
    this.getItems();
  },
};
</script>

<style></style>
