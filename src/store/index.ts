import Vue from "vue";
import Vuex from "vuex";
import { dividends } from "./dividends";
import { portfolio } from "./portfolio";
import { user } from "./user";
import { RootState } from "@/types/state";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
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
