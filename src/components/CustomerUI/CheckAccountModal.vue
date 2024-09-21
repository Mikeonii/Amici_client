<template>
  <div>
    <v-btn @click="dialog = true">
      <v-icon> mdi-account </v-icon>
      Check Account
    </v-btn>
    <v-dialog v-model="dialog" width="1500">
      <v-card>
        <v-card-text class="pa-2">
          <div class="pa-8 mt-n5">
            <v-row class="">
              <v-col> <h2>Accounts Table</h2> </v-col>
              <v-spacer></v-spacer>
              <v-col class="d-flex justify-end">
                <add-account-modal />
                <v-btn class="ml-2" @click="refresh">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-text-field
              autofocus
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-data-table
              :search="search"
              :items="accounts"
              :headers="headers"
              :loading="table_loading"
            >
              <template v-slot:item.action="{ item }">
                <div class="d-flex">
                  <account-modal :item="item" />
                  <modify-expiration-modal :item="item" />
                  <edit-account-modal :item="item" />
                  <v-btn icon @click="print_waiver(item)">
                    <v-icon color="green">mdi-printer</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    color="red"
                    @click="del(item.id)"
                    :loading="button_loading"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </div>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <p class="caption">CheckAccountModal.vue</p>
        </v-card-actions>
      </v-card></v-dialog
    >
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AccountModal from "@/components/Account/AccountModal.vue";
import AddAccountModal from "@/components/Account/AddAccountModal.vue";
import EditAccountModal from "@/components/Account/EditAccountModal.vue";
import ModifyExpirationModal from "../Account/modifyExpirationModal.vue";
export default {
  components: {
    AddAccountModal,
    EditAccountModal,
    AccountModal,
    ModifyExpirationModal,
  },
  data() {
    return {
      dialog: false,
      table_loading: false,
      search: "",
      button_loading: false,
      headers: [
        {
          text: "",
          value: "action",
        },
        {
          text: "ID",
          value: "id",
        },
        { text: "Name", value: "name" },
        { text: "Birthdate", value: "birth_date" },
        { text: "Address", value: "address" },
        { text: "Gender", value: "gender" },
        { text: "Phone", value: "phone_number" },
        { text: "Card Number", value: "card_no" },
        { text: "Rank", value: "rank" },
        // { text: "Credits", value: "credits" },
        { text: "Phone Number", value: "phone_number" },
        { text: "Monthly Expiry Date", value: "expiry_date" },
        { text: "Yearly Expiry Date", value: "yearly_expiry_date" },
      ],
    };
  },
  created() {
    if (this.accounts.length == 0) {
      this.get_accounts();
    }
  },
  computed: {
    ...mapGetters({
      accounts: "account/accounts",
      default_server_url: "auth/default_server_url",
    }),
  },
  methods: {
    ...mapActions({
      get_accounts: "account/get_accounts",
      delete_account: "account/delete_account",
    }),

    print_waiver(item) {
      // console.log(item);
      let x = window.confirm("Are you sure you want to proceed?");
      if (x) {
        let url = this.default_server_url + "/print_waiver_form/" + item.id;
        window.open(url);
      }
    },
    refresh() {
      this.table_loading = true;
      this.get_accounts().then(() => {
        this.table_loading = false;
      });
    },
    del(id) {
      let x = window.confirm("Are you sure you want to delete this account?");
      if (x) {
        this.button_loading = true;
        this.delete_account(id).then(() => {
          alert("Successfully deleted an account");
        });
        this.button_loading = false;
      }
    },
  },
};
</script>

<style></style>
