export default {
  namespaced: true,
  state: {
    notification: {
      message: "",
      color: "",
      icon: "",
      showing: false,
    },
    confirm_notification: {
      item: [],
      message:
        "lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet, consectetur?",
      icon: "mdi-help-circle",
      is_confirmed: false,
      type: "warning",
    },
  },
  getters: {},
  mutations: {
    CONFIRM(state) {
      state.confirm_notification.is_confirmed =
        !state.confirm_notification.is_confirmed;
      console.log(state.confirm_notification.is_confirmed);
    },
    SET_CONFIRM_NOTIFICATION(state, confirm_notification) {
      state.confirm_notification = confirm_notification;
    },
    SET_NOTIFICATION(state, notification) {
      state.notification = notification;
      setTimeout(() => {
        state.notification = {
          message: "",
          color: "",
          icon: "",
          showing: false,
        };
      }, 3000);
    },
  },
  actions: {
    confirm({ commit }) {
      commit("CONFIRM");
    },
    set_confirm_notification({ commit }, confirm_notification) {
      commit("SET_CONFIRM_NOTIFICATION", confirm_notification);
    },
    set_notification({ commit }, notification) {
      commit("SET_NOTIFICATION", notification);
    },
  },
};
