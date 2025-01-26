import axios from "axios";
export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    items(state) {
      return state.items;
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
  },
};
