import axios from "axios";
export default {
  namespaced: true,
  state: {
    items: [],
    item_transactions: [],
  },
  getters: {
    items(state) {
      return state.items;
    },
    item_transactions(state) {
      return state.item_transactions;
    },
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
    ADD_ITEM(state, item) {
      state.items.unshift(item);
    },
    EDIT_ITEM(state, item) {
      var index = state.items.findIndex((a) => a.id == item.id);
      state.items.splice(index, 1, item);
    },
    DELETE_ITEM(state, item_id) {
      let filtered = state.items.filter((c) => {
        return c.id != item_id;
      });
      state.items = filtered;
    },

    // TRANSACTIONS
    SET_ITEM_TRANSACTIONS(state, item_transactions) {
      state.item_transactions = item_transactions;
    },
    ADD_ITEM_TRANSACTION(state, item_transaction) {
      state.item_transactions.unshift(item_transaction);
    },
  },
  actions: {
    // get items
    async get_items({ commit }) {
      let response = await axios.get("/items");
      commit("SET_ITEMS", response.data);
    },
    async add_item({ commit }, request) {
      let response = await axios.post("/item", request);
      commit("ADD_ITEM", response.data);
    },
    async edit_item({ commit }, request) {
      let response = await axios.put("/item", request);
      commit("EDIT_ITEM", response.data);
    },
    async delete_item({ commit }, item_id) {
      await axios.delete("/item/" + item_id);
      commit("DELETE_ITEM", item_id);
    },

    // ITEM TRANSACTIONS
    async get_item_transactions({ commit }, account_id) {
      let response = await axios.get("/item_transactions/" + account_id);
      console.log(response.data);
      commit("SET_ITEM_TRANSACTIONS", response.data);
    },

    async add_item_transaction({ dispatch }, request) {
      console.log(request.request[0].account_id);
      let response = await axios.post("/item_transaction", request);
      console.log("item response", response.data);

      dispatch("get_item_transactions", request.request[0].account_id);
      // get credit transactions
      dispatch(
        "account/get_credit_transactions",
        request.request[0].account_id,
        { root: true }
      );
    },
  },
};
