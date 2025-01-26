<template>
  <v-container>
    <div class="pa-8 mt-n5">
      <v-row class="">
        <!-- TODO finish this -->
        <v-col> <h2>Items Table</h2> </v-col>
      <v-spacer></v-spacer>
        <v-col class="d-flex justify-end">
          <add-item-modal />
          <v-btn class="ml-2" @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-text-field
        v-model="search"
        label="Search Item"
        prepend-icon="mdi-magnify"
      ></v-text-field>
      <v-data-table
        :search="search"
        :items="items"
        :headers="item_header"
        :loading="table_loading"
      >
        <template v-slot:item.action="{ item }">
          <div class="d-flex">
            <edit-item-modal :item="item" />
            <v-btn color="red" @click="del(item)" icon
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </div>
        </template>
        <template v-slot:item.created_at="{ item }">
          {{ formatted_dateTime(item.created_at) }}
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import AddItemModal from "../components/Item/AddItemModal.vue";
import EditItemModal from "../components/Item/EditItemModal.vue";
export default {
  data() {
    return {
      search: "",
      table_loading: true,
      item_header: [
        { text: "", value: "action" },
        { text: "ID", value: "id" },
        { text: "Item Name", value: "item_name" },
        { text: "Unit Price", value: "unit_price" },
        { text: "Selling Price", value: "selling_price" },
        { text: "Stocks", value: "stocks" },
        { text: "Unit", value: "unit" },
        { text: "Created at", value: "created_at" },
      ],
    };
  },
  mounted() {
    if (this.items.length == 0) this.table_loading = true;
    this.get_items().then(() => {
      this.table_loading = false;
    });
  },
  components: { AddItemModal, EditItemModal },
  methods: {
    ...mapActions({
      get_items: "item/get_items",
    }),
    del(item) {
      return item;
    },
    formatted_dateTime(dateTime) {
      return moment(dateTime).format("MMMM D, YYYY - h:m:s A");
    },
    refresh() {
      this.table_loading = true;
      this.get_items().then(() => {
        this.table_loading = false;
      });
    },
  },
  computed: {
    ...mapGetters({
      items: "item/items",
    }),
  },
};
</script>

<style></style>
