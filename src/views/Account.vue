<template>
  <v-container>
    <div>
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
            <edit-account-modal :item="item" />

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
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AccountModal from "../components/Account/AccountModal.vue";
import AddAccountModal from "../components/Account/AddAccountModal.vue";
import EditAccountModal from "../components/Account/EditAccountModal.vue";
export default {
  components: { AddAccountModal, EditAccountModal, AccountModal },
  data() {
    return {
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
        { text: "Card Number", value: "card_no" },
        { text: "Rank", value: "rank" },
        { text: "Credits", value: "credits" },
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
    }),
  },
  methods: {
    ...mapActions({
      get_accounts: "account/get_accounts",
      delete_account: "account/delete_account",
    }),
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
