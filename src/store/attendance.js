import axios from "axios";
export default {
  namespaced: true,
  state: {
    attendances: [],
  },
  getters: {
    attendances(state) {
      return state.attendances;
    },
  },
  mutations: {
    SET_ATTENDANCES(state, attendances) {
      state.attendances = attendances;
    },
    ADD_ATTENDANCE(state, attendance) {
      state.attendances.unshift(attendance);
    },
  },
  actions: {
    // get attendances
    async get_attendances({ commit }) {
      let response = await axios.get("/attendances");
      commit("SET_ATTENDANCES", response.data);
    },
    async add_attendance({ commit }, card_no) {
      let response = await axios.post("/attendance/" + card_no);
      if (response.data == "Account not registered")
        return alert("Account not registered");
      commit("ADD_ATTENDANCE", response.data);
    },
  },
};
