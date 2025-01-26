import axios from "axios";
export default {
  namespaced: true,
  state: {
    admins: null,
  },
  getters: {
    admins(state) {
      return state.admins;
    },
  },
  mutations: {
    SET_ADMINS(state, admins) {
      // add full name key to each agent
      // admins.forEach(a => {
      //     const full_name =
      //         a.surname + ', ' + a.name;
      //     a.full_name = full_name;
      // });
      state.admins = admins;
    },
  },
  actions: {
    // get admins
    async get_admins({ commit }) {
      let response = await axios.get("http://localhost:3000/admins");
      commit("SET_ADMINS", response.data);
    },
  },
};
