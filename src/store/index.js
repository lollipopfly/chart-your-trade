import Vue from "vue";
import Vuex from "vuex";
import user from "./user";
import portfolio from "./portfolio";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null,
  },
  mutations: {
    SET_ERROR(state, payload) {
      state.error = payload;
    },
  },
  actions: {},
  modules: {
    user,
    portfolio,
  },
});
