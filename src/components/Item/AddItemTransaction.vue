<template>
  <div>
    <v-btn color="primary     " @click="dialog = true">Add</v-btn>
    <v-dialog v-model="dialog" width="900" persistent>
      <v-card>
        <v-card-title>Add Item Transaction</v-card-title>
        <v-card-text>
          <div>
            <!-- SELECTED ITEM -->
            <div>
              <v-row class="mt-2">
                <v-col d-flex>
                  <h4>Item Name:</h4>
                  <h2 class="ml-2">
                    <span
                      class="green--text"
                      v-if="this.selected_item.item_name"
                      >{{ selected_item.item_name }}</span
                    >
                    <span v-else class="red--text">
                      Please Select an Item
                    </span>
                  </h2>
                </v-col>

                <v-col>
                  <v-select
                    class="ml-4"
                    v-model="selected_item.method"
                    :items="methodItems"
                    label="Method"
                    item-text="text"
                    item-value="value"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="1">
                  <h4>Item ID:</h4>
                  {{ selected_item.id }}
                </v-col>
                <v-col cols="2">
                  <h4>Selling Price:</h4>
                  {{ selected_item.selling_price }}
                </v-col>
                <v-col cols="2">
                  <h4>Stocks:</h4>
                  {{ selected_item.stocks }}
                </v-col>
                <v-col cols="1">
                  <h4>Unit:</h4>
                  {{ selected_item.unit }}
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type="number"
                    label="Quantity"
                    v-model="quantity"
                    @input="calculate()"
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="d-flex">
                  <v-text-field
                    readonly
                    type="number"
                    label="Total Amount"
                    v-model="this.selected_item.total_amount"
                  ></v-text-field>
                  <v-btn
                    class="mt-2 ml-2"
                    color="yellow"
                    @click="confirm_add"
                    :loading="button_loading"
                    >Add</v-btn
                  >
                </v-col>
              </v-row>
            </div>
          </div>
          <v-text-field
            label="Search "
            prepend-icon="mdi-magnify"
            v-model="item_search"
          ></v-text-field>
          <v-data-table
            dense
            :items="items"
            :headers="items_headers"
            :search="item_search"
          >
            <template v-slot:item.action="{ item }">
              <v-btn small @click="select(item)" color="success">Select</v-btn>
            </template>
          </v-data-table>
          <alert-modal
            title="Alert"
            :message="alertMessage"
            v-if="enableAlert"
            @close="enableAlert = false"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <p class="caption">AddItemTransaction.vue</p>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: { alertModal: () => import("../alertModal.vue") },
  props: ["account_id"],
  data() {
    return {
      methodItems: [
        {
          text: "Renew",
          value: "renew",
        },
        { text: "Continue", value: "continue" },
      ],
      alertMessage: "",
      enableAlert: "",
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
    calculate() {
      this.selected_item.total_amount =
        this.selected_item.selling_price * this.quantity;
      this.selected_item.quantity = this.quantity;
      console.log(this.selected_item);
    },
    submit() {},
    select(item) {
      this.selected_item.method = "renew";
      this.selected_item = item;
      this.selected_item.account_id = this.account_id;
    },
    confirm_add() {
      this.button_loading = true;
      this.add_item_transaction(this.selected_item)
        .then(() => {
          this.alertMessage = "Successfully added an item transaction";
          this.enableAlert = true;
        })
        .catch((err) => {
          this.alertMessage = err;
          this.enableAlert = true;
        });

      this.button_loading = false;
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
    this.selected_item.method = "renew";
    if (this.items.length == 0) this.get_items();
  },
};
</script>

<style></style>
