<template>
  <div>
    <v-btn @click="dialog = true" color="pink" class="white--text"
      >Subscriptions</v-btn
    >
    <v-dialog v-model="dialog" width="1200" persistent>
      <v-card>
        <v-card-title>Subscriptions</v-card-title>
        <v-card-text>
          <div class="mb-10">
            <!-- SELECTED ACCOUNT -->
            <div>
              <v-row>
                <v-col cols="3">
                  <h4>Account Name:</h4>
                  <h2 class="ml-2">
                    <span
                      class="blue--text"
                      v-if="this.selected_account.name"
                      >{{ selected_account.name }}</span
                    >
                    <span v-else class="red--text">
                      Please Select an Account
                    </span>
                  </h2></v-col
                >
              </v-row>
            </div>
            <br />
            <br />
            <!-- SELECTED ITEM -->
            <div>
              <v-row> </v-row>

              <v-row>
                <v-col cols="3">
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
                <v-col cols="1">
                  <h4>Price:</h4>
                  {{ selected_item.selling_price }}
                </v-col>

                <v-col cols="2">
                  <v-text-field
                    type="number"
                    label="Quantity"
                    v-model="quantity"
                    @input="calculate()"
                  ></v-text-field>
                </v-col>
                <v-col cols="5" class="d-flex">
                  <v-text-field
                    readonly
                    type="number"
                    label="Total Amount"
                    v-model="this.selected_item.total_amount"
                  ></v-text-field>
                  <v-select
                    class="ml-2"
                    label="Payment Method"
                    :items="paymentItems"
                    v-model="paymentMethod"
                  ></v-select>
                  <v-select
                    class="ml-4"
                    v-model="selected_item.method"
                    :items="methodItems"
                    label="Method"
                  ></v-select>
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
          <v-row>
            <v-col cols="6">
              <!-- Accounts -->
              <v-row>
                <v-col>
                  <h3>Accounts</h3>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="3">
                  <v-btn small text color="success" @click="get_accounts()">
                    <v-icon>mdi-refresh</v-icon> Refresh
                  </v-btn>
                </v-col>
              </v-row>
              <v-text-field
                label="Search Account"
                prepend-icon="mdi-magnify"
                v-model="search"
              ></v-text-field>
              <v-data-table
                dense
                :search="search"
                :items="accounts"
                :headers="accountHeaders"
              >
                <template v-slot:item.action="{ item }">
                  <v-btn small color="success" @click="selectAccount(item)"
                    >Select</v-btn
                  >
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="6">
              <!-- Items and Subscriptions -->
              <h3>Items and Subscriptions</h3>

              <v-text-field
                label="Search Item"
                prepend-icon="mdi-magnify"
                v-model="itemSearch"
              ></v-text-field>
              <v-data-table
                dense
                :search="itemSearch"
                :items="items"
                :headers="itemHeaders"
              >
                <template v-slot:item.action="{ item }">
                  <v-btn small color="yellow" @click="selectItem(item)"
                    >Select</v-btn
                  >
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <div>
            <br />
            <br />

            <v-row>
              <v-col>
                <h3>Subscription Transactions</h3>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="3">
                <v-btn
                  small
                  text
                  color="success"
                  @click="get_item_transactions()"
                >
                  <v-icon>mdi-refresh</v-icon> Refresh
                </v-btn>
              </v-col>
            </v-row>
            <v-text-field
              label="Item Transaction Search"
              v-model="itemTransactionSearch"
            ></v-text-field>
            <v-data-table
              :search="itemTransactionSearch"
              :items="itemTransactions"
              :headers="itemTransactionHeaders"
            >
              <template v-slot:item.action="{ item }">
                <v-btn icon color="red" @click="deleteTransaction(item)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </template>
            </v-data-table>
          </div>
          <!-- lazy -->
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
          <p class="caption">addSubscriptionModal.vue</p>
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import alertModal from "../alertModal.vue";

export default {
  components: { alertModal },
  data() {
    return {
      alertMessage: "",
      enableAlert: false,
      methodItems: ["Renew", "Continue"],
      paymentItems: ["Cash", "Gcash"],
      paymentMethod: "Cash",
      selected_item: {},
      selected_account: {},
      itemTransactions: [],
      itemSearch: "",
      search: " ",
      itemTransactionSearch: "",
      quantity: 0,
      dialog: false,
      button_loading: false,
      accountHeaders: [
        { text: "Action", value: "action" },
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Monthly Expiry Date", value: "expiry_date" },
        { text: "Membership Expiry Date", value: "yearly_expiry_date" },
      ],
      itemHeaders: [
        { text: "Action", value: "action" },
        { text: "ID", value: "id" },
        { text: "Item Name", value: "item_name" },
        { text: "Item Type", value: "item_type" },
        { text: "Selling Price", value: "selling_price" },
      ],
      itemTransactionHeaders: [
        { text: "Action", value: "action" },
        { text: "ID", value: "id" },
        { text: "Account Name", value: "account.name" },
        { text: "Item Name", value: "item.item_name" },
        { text: "Payment Method", value: "payment_method" },
        { text: "Quantity", value: "quantity" },
        { text: "Total Amount", value: "amount" },
        { text: "Posted By", value: "posted_by" },
        { text: "Posted Date", value: "created_at" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      accounts: "account/accounts",
      items: "item/items",
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      add_item_transaction: "item/add_item_transaction",
      get_accounts: "account/get_accounts",
    }),
    async deleteTransaction(item) {
      if (this.user.username != "admin") {
        this.alertMessage = "You are not allowed to perform this action";
        this.enableAlert = true;
        return;
      }
      await axios.delete("/item_transaction/" + item.id);
      this.get_item_transactions();
      this.alertMessage = "Successfully deleted an item transaction";
      this.enableAlert = true;
    },
    async get_item_transactions() {
      let itemTransactions = await axios.get("/item_transactions");
      this.itemTransactions = itemTransactions.data;
      console.log("itemTransactions", this.itemTransactions);
    },
    calculate() {
      this.selected_item.total_amount =
        this.selected_item.selling_price * this.quantity;
      this.selected_item.quantity = this.quantity;
    },
    selectItem(item) {
      this.selected_item = item;
    },
    selectAccount(item) {
      this.selected_account = item;
    },
    submit() {
      return;
    },
    confirm_add() {
      if (!this.selected_account.id) {
        this.alertMessage = "Please select an account first";
        this.enableAlert = true;
        return;
      }

      if (this.selected_item.total_amount <= 0) {
        this.alertMessage = "Please check total amount field";
        this.enableAlert = true;
        return;
      }
      this.selected_item.account_id = this.selected_account.id;

      this.button_loading = true;
      this.selected_item.payment_method = this.paymentMethod;
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
  created() {
    this.get_item_transactions();
  },
};
</script>

<style></style>
