import axios from "axios";
export default {
  namespaced: true,
  state: {
    attendance_summary: [],
    sales_summary: [],
  },
  getters: {
    attendance_summary(state) {
      return state.attendance_summary;
    },
    sales_summary(state) {
      return state.sales_summary;
    },
  },
  mutations: {
    SET_attendance_summary(state, attendance_summary) {
      state.attendance_summary = attendance_summary;
    },
    ADD_ITEM(state, item) {
      state.attendance_summary.unshift(item);
    },
    EDIT_ITEM(state, item) {
      var index = state.attendance_summary.findIndex((a) => a.id == item.id);
      state.attendance_summary.splice(index, 1, item);
    },
    DELETE_ITEM(state, item_id) {
      let filtered = state.attendance_summary.filter((c) => {
        return c.id != item_id;
      });
      state.attendance_summary = filtered;
    },

    // SALES
    SET_sales_summary(state, sales_summary) {
      state.sales_summary = sales_summary;
    },
    ADD_ITEM_TRANSACTION(state, item_transaction) {
      state.sales_summary.unshift(item_transaction);
    },
  },
  actions: {
    // get attendance_summary
    async get_attendance_summary({ commit }) {
      let response = await axios.get("/attendance_summary");
      commit("SET_attendance_summary", response.data);
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
    async get_sales_summary({ commit }, account_id) {
      let response = await axios.get("/sales_summary/" + account_id);
      console.log(response.data);
      commit("SET_sales_summary", response.data);
    },

    async add_item_transaction({ dispatch, commit }, request) {
      let response = await axios.post("/item_transaction", request);

      dispatch("get_sales_summary", request.account_id);
      // get credit transactions
      dispatch("account/get_credit_transactions", request.account_id, {
        root: true,
      });
      // update account expiry
      commit("account/EDIT_ACCOUNT", response.data, { root: true });
    },
  },
};
