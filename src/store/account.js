import axios from "axios";
export default {
  namespaced: true,
  state: {
    accounts: [],
    measurement: [],
  },
  getters: {
    accounts(state) {
      return state.accounts;
    },
    measurement(state) {
      return state.measurement;
    },
  },
  mutations: {
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
  },
  actions: {
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

    async get_measurement({ commit }, account_id) {
      let response = await axios.get("/measurement/" + account_id);
      commit("SET_MEASUREMENT", response.data);
    },
  },
};
