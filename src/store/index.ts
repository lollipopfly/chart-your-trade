import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import { dividends, dividendsInitialState } from "./dividends";
import { portfolio, portfolioInitialState } from "./portfolio";
import { user, userInitialState } from "./user";
import { RootState } from "@/types/state";

Vue.use(Vuex);

const rootInitialState = (): RootState => {
  return {
    error: null,
  };
};

const initialState = {
  error: rootInitialState(),
  user: userInitialState(),
  dividends: dividendsInitialState(),
  portfolio: portfolioInitialState(),
};

export default new Vuex.Store<RootState>({
  state: rootInitialState(),

  mutations: {
    CLEAR_STATE(state) {
      for (const f in state) {
        Vue.set(state, f, initialState[f as keyof RootState]);
      }
    },

    SET_ERROR(state, payload) {
      state.error = payload;
    },
  },

  actions: {
    async LOGOUT({ commit }): Promise<void> {
      await firebase.auth().signOut();

      commit("CLEAR_STATE");
    },
  },

  modules: {
    dividends,
    portfolio,
    user,
  },
});
