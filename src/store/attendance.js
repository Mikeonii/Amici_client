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
    EDIT_ATTENDANCE(state, attendance) {
      var index = state.attendances.findIndex((a) => a.id == attendance.id);
      state.attendances.splice(index, 1, attendance);
    },
  },
  actions: {
    // get attendances
    async get_attendances({ commit }) {
      let response = await axios.get("/attendances");
      commit("SET_ATTENDANCES", response.data);
    },
    async add_attendance({ commit }, card_no) {
      var res;
      let response = await axios.post("/attendance/" + card_no);
      console.log(response.data);
      // check if response is string(with errors) return and display as errors
      if (typeof response.data == "string") {
        res = [null, response.data];
        return res;
      }
      // for log out
      else if (response.data[1] == "Thank you for coming in") {
        res = [response.data[0], "Thank you for coming in"];
        commit("EDIT_ATTENDANCE", res[0]);
        return res;
      }
      // for log in
      else {
        res = [response.data, "Successfully logged in"];
        // if not, add attendance row to the table
        commit("ADD_ATTENDANCE", res[0]);
        return res;
      }
    },
  },
};
