<template>
  <div>
    <v-btn color="primary" small @click="dialog = true">Add</v-btn>
    <v-dialog v-model="dialog" width="850" persistent>
      <v-card>
        <v-card-title>Add Item Transaction</v-card-title>
        <v-card-text>
          <div>
            <v-card>
              <v-card-title>
                <p class="subtitle-1">Selected Items</p></v-card-title
              >
              <v-card-text>
                <!-- CONFIRMED ITEM HEADERS -->
                <v-row>
                  <v-col cols="3">
                    <h4 class="success--text">Item Name:</h4>
                  </v-col>
                  <v-col>
                    <h4 class="success--text">Selling Price:</h4>
                  </v-col>
                  <v-col>
                    <h4 class="success--text">Stocks:</h4>
                  </v-col>
                  <v-col>
                    <h4 class="success--text">Unit:</h4>
                  </v-col>
                  <v-col>
                    <h4 class="success--text">Quantity:</h4>
                  </v-col>
                  <v-col>
                    <h4 class="success--text">Total Amount:</h4>
                  </v-col>
                </v-row>
                <!-- CONFIRMED ITEMS -->
                <v-row
                  class="mt-n5"
                  v-for="confirmed_item in confirmed_items"
                  :key="confirmed_item.id"
                >
                  <v-col cols="3">
                    {{ confirmed_item.item_name }}
                  </v-col>
                  <v-col>
                    {{ confirmed_item.selling_price }}
                  </v-col>
                  <v-col>
                    {{ confirmed_item.stocks }}
                  </v-col>
                  <v-col>
                    {{ confirmed_item.unit }}
                  </v-col>
                  <v-col>
                    {{ confirmed_item.quantity }}
                  </v-col>
                  <v-col>
                    {{ confirmed_item.total_amount }}
                  </v-col>
                </v-row>

                <div class="d-flex justify-end mt-5 mb-2">
                  <h3>Total Amount: {{ total_payable_amount }}</h3>
                </div>

                <v-divider class="mb-3 mt-3"></v-divider>
                <!-- SELECTED ITEM -->
                <div>
                  <v-row>
                    <v-col cols="3">
                      <h4>Item Name:</h4>
                      {{ selected_item.item_name }}
                    </v-col>
                    <v-col>
                      <h4>Selling Price:</h4>
                      {{ selected_item.selling_price }}
                    </v-col>
                    <v-col>
                      <h4>Stocks:</h4>
                      {{ selected_item.stocks }}
                    </v-col>
                    <v-col>
                      <h4>Unit:</h4>
                      {{ selected_item.unit }}
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        type="number"
                        label="Quantity"
                        v-model="quantity"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        readonly
                        type="number"
                        label="Total Amount"
                        v-model="total_amount"
                      ></v-text-field>
                      <v-btn small color="yellow" @click="confirm_add"
                        >Confirm</v-btn
                      >
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </div>
          <v-text-field
            label="Search "
            prepend-icon="mdi-magnify"
            v-model="item_search"
          ></v-text-field>
          <v-data-table
            :items="items"
            :headers="items_headers"
            :search="item_search"
          >
            <template v-slot:item.action="{ item }">
              <v-btn @click="select(item)" color="success" small> Add</v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submit" color="primary" :loading="button_loading"
            >Submit</v-btn
          >
          <v-btn @click="confirmed_items = []" color="yellow">Reset</v-btn>
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["account_id"],
  data() {
    return {
      quantity: 0,
      selected_item: {},
      confirmed_items: [],
      item_search: "",
      items_headers: [
        { text: "", value: "action" },
        { text: "ID", value: "id" },
        { text: "Item Name", value: "item_name" },
        { text: "Selling Price", value: "selling_price" },
        { text: "Stocks", value: "stocks" },
        { text: "Unit", value: "unit" },
      ],
      dialog: false,
      button_loading: false,
    };
  },
  methods: {
    ...mapActions({
      get_items: "item/get_items",
      add_item_transaction: "item/add_item_transaction",
    }),
    submit() {
      let x = window.confirm("Are you sure you want to add these items?");
      if (x) {
        this.button_loading = true;
        this.add_item_transaction({ request: this.confirmed_items })
          .then(() => {
            alert("Successfully added an item transaction");
          })
          .catch((err) => {
            alert(err);
          });

        this.button_loading = false;
      }
    },
    select(item) {
      this.selected_item = item;
    },
    confirm_add() {
      this.selected_item.quantity = this.quantity;
      this.selected_item.total_amount = this.total_amount;
      this.selected_item.account_id = this.account_id;
      this.selected_item.item_id = this.selected_item.id;

      this.confirmed_items.unshift(this.selected_item);
    },
  },
  computed: {
    ...mapGetters({
      items: "item/items",
    }),
    total_amount() {
      return this.selected_item.selling_price * this.quantity;
    },
    total_payable_amount() {
      let total = 0;
      this.confirmed_items.forEach((c) => {
        total += c.total_amount;
      });
      return total;
    },
  },
  mounted() {
    if (this.items.length == 0) this.get_items();
  },
};
</script>

<style></style>
