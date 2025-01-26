// import axios from "axios";
export default {
  namespaced: true,
  state: {
    actions: [],
  },
  getters: {},
  mutations: {
    ADD_ACTION(state, action_request) {
      state.actions.push(action_request);
    },
  },
  actions: {
    // get all actions taken in localStorage
    add_action({ commit }, action_request) {
      commit("ADD_ACTION", action_request);
    },
  },
};
