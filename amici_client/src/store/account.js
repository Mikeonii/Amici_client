import axios from "axios";
export default {
  namespaced: true,
  state: {
    accounts: [],
    credit_transactions: [],
    measurements: [],
    item_transactions: [],
    top_gymmers: [],
    top_gymmers_of_current_month: [],
  },
  getters: {
    accounts(state) {
      return state.accounts;
    },
    credit_transactions(state) {
      return state.credit_transactions;
    },
    measurements(state) {
      return state.measurements;
    },
    item_transactions(state) {
      return state.item_transactions;
    },
    top_gymmers(state) {
      return state.top_gymmers;
    },
    top_gymmers_of_current_month(state) {
      return state.top_gymmers_of_current_month;
    },
  },
  mutations: {
    SET_TOP_GYMMERS_OF_CURRENT_MONTH(state, top_gymmers) {
      state.top_gymmers_of_current_month = top_gymmers;
    },
    SET_TOP_GYMMERS(state, top_gymmers) {
      state.top_gymmers = top_gymmers;
    },
    SET_ACCOUNTS(state, accounts) {
      state.accounts = accounts;
    },
    ADD_ACCOUNT(state, account) {
      state.accounts.unshift(account);
    },
    EDIT_ACCOUNT(state, account) {
      var index = state.accounts.findIndex((a) => a.id == account.id);
      state.accounts.splice(index, 1, account);
    },
    DELETE_ACCOUNT(state, account_id) {
      let filtered = state.accounts.filter((c) => {
        return c.id != account_id;
      });
      state.accounts = filtered;
    },
    SET_MEASUREMENT(state, measurement) {
      state.measurement = measurement;
    },
    // CREDIT
    SET_CREDIT_TRANSACTIONS(state, credit_transactions) {
      state.credit_transactions = credit_transactions;
    },
    ADD_CREDIT(state, credit) {
      state.credit_transactions.unshift(credit);
    },
    // ITEM
    SET_ITEM_TRANSACTIONS(state, item_transactions) {
      state.item_transactions = item_transactions;
    },
    // MEASUREMENTS
    SET_MEASUREMENTS(state, measurements) {
      state.measurements = measurements;
    },
    ADD_MEASUREMENT(state, measurement) {
      state.measurements.unshift(measurement);
    },
  },
  actions: {
    async modify_expiry_dates({ commit }, request) {
      let response = await axios.put("/modify_expiry_dates", request);
      commit("EDIT_ACCOUNT", response.data);
    },
    async upload_profile_picture({ commit }, request) {
      let response = await axios.post("/upload_profile_picture", request);
      commit("EDIT_ACCOUNT", response.data);
    },

    async upload_body_improvement_picture({ commit }, request) {
      let response = await axios.post(
        "/upload_body_improvement_picture",
        request
      );

      commit("EDIT_ACCOUNT", response.data);
    },
    async get_top_gymmers({ commit }) {
      let response = await axios.get("/top_gymmers");
      commit("SET_TOP_GYMMERS", response.data);
    },
    async get_top_gymmers_of_the_month({ commit }, request) {
      let response = await axios.get(
        "/get_top_gymmer_of_the_month/" + request.month + "/" + request.year
      );
      commit("SET_TOP_GYMMERS_OF_CURRENT_MONTH", response.data);
    },
    // get accounts
    async get_accounts({ commit }) {
      let response = await axios.get("/accounts");
      commit("SET_ACCOUNTS", response.data);
    },

    async add_account({ commit }, request) {
      let response = await axios.post("/account", request);
      commit("ADD_ACCOUNT", response.data);
    },

    async edit_account({ commit }, request) {
      let response = await axios.put("/account", request);
      commit("EDIT_ACCOUNT", response.data);
    },

    async delete_account({ commit }, account_id) {
      await axios.delete("/account/" + account_id);
      commit("DELETE_ACCOUNT", account_id);
    },

    // CREDIT_TRANSACTIONS
    async get_credit_transactions({ commit }, account_id) {
      let response = await axios.get("/credit_transactions/" + account_id);
      commit("SET_CREDIT_TRANSACTIONS", response.data);
    },
    async add_credit_transaction({ commit }, request) {
      let response = await axios.post("/credit_transaction", request);
      commit("ADD_CREDIT", response.data);
    },
    async get_item_transactions({ commit }, account_id) {
      let response = await axios.get("/item_transaction/" + account_id);
      commit("SET_ITEM_TRANSACTIONS", response.data);
    },
    // BODY MEASUREMENT
    async get_measurements({ commit }, account_id) {
      let response = await axios.get("/measurements/" + account_id);
      commit("SET_MEASUREMENTS", response.data);
    },
    async get_measurement({ commit }, account_id) {
      let response = await axios.get("/measurement/" + account_id);
      commit("SET_MEASUREMENT", response.data);
    },
    async add_measurement({ commit }, request) {
      let response = await axios.post("/measurement", request);
      commit("ADD_MEASUREMENT", response.data);
    },
  },
};
