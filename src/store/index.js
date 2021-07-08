import Vue from "vue";
import Vuex from "vuex";
import dividends from "./dividends";
import portfolio from "./portfolio";
import user from "./user";

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
    dividends,
    portfolio,
    user,
  },
});
