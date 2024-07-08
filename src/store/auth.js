import axios from "axios";
export default {
  namespaced: true,
  state: {
    // state of app. can store anything from strings to objects
    token: null,
    user: null,
    show_navs: true,
  },
  // read info from state
  getters: {
    default_server_url() {
      return "http://127.0.0.1:8000";
      // return "https://server.jmbcomputers.com";
    },
    show_navs(state) {
      return state.show_navs;
    },
    authenticated(state) {
      return state.token && state.user;
    },
    user(state) {
      return state.user;
    },
    token(state) {
      return state.token;
    },
  },
  mutations: {
    // update the state
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, data) {
      state.user = data;
    },
    TOGGLE_NAVS(state) {
      state.show_navs = !state.show_navs;
    },
  },
  actions: {
    toggle_navs({ commit }) {
      commit("TOGGLE_NAVS");
    },
    // make request to api but commit to mutations
    async signin({ dispatch }, credentials) {
      let response = await axios.post("auth/signin", credentials);
      return dispatch("attempt", response.data);
    },
    // attempt to access me api to check if token is valid
    // and give us back the users info
    async attempt({ commit, state }, token) {
      // if there is a token, commit
      if (token) {
        commit("SET_TOKEN", token);
      }
      // if there is no token in the sate, stop the execution
      if (!state.token) {
        return;
      }
      // check token if it is valid in me api
      try {
        // pass header for authorization
        let response = await axios.get("auth/attempt");
        // if it is true, set_user to response
        commit("SET_USER", response.data);
        // get services
        // this.$store.dispatch('services/get', response.data.branch_id, { root: true });
      } catch (e) {
        // if errors occurs set state to null
        commit("SET_TOKEN", null);
        commit("SET_USER", null);
      }
    },
    signout({ commit }) {
      return axios.post("auth/signout").then(() => {
        commit("SET_TOKEN", null);
        commit("SET_USER", null);
      });
    },
    async on_page_reload({ dispatch, rootState }) {
      // if page gets refreshed
      if (!rootState.contract.contracts_consolidation) {
        await dispatch("contract/get_contracts_consolidation", "", {
          root: true,
        });
      }
      if (!rootState.contract.contracts) {
        await dispatch("contract/get_contracts", "", { root: true });
      }
      if (!rootState.agent.agents) {
        await dispatch("agent/get_agents", "", { root: true });
      }
      if (!rootState.branch.branches) {
        await dispatch("branch/get_branches", "", { root: true });
      }

      return true;
      // if (rootState.payments == null) {
      //   await dispatch("payment/get_payments", '', { root: true })
      // }
      // console.log("ready")
      // console.log(rootState.branch.branches)
    },
  },
};
