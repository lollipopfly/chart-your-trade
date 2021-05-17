import Vue from "vue";
import firebase from "firebase/app";

export default {
  namespaced: true,

  state: {
    list: {},
  },

  mutations: {
    SET_PORTFOLIO(state, payload) {
      state.list = payload;
    },

    PUSH_TO_PORTFOLIO(state, payload) {
      const key = Object.keys(payload);

      state.list[key] = payload[key];
    },

    REMOVE_FROM_PORTFOLIO(state, payload) {
      Vue.delete(state.list, payload);
    },
  },

  actions: {
    async ADD_PORTFOLIO({ commit, rootGetters }, title) {
      const userId = rootGetters["user/GET_USER_ID"];
      const params = {
        title: title,
        uid: userId,
      };

      try {
        const data = await firebase
          .database()
          .ref(`/users/${userId}/portfolios`)
          .push(params);
        const newPortfolioItem = {};
        newPortfolioItem[data.key] = params;

        commit("PUSH_TO_PORTFOLIO", newPortfolioItem);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async FETCH_PORTFOLIO_LIST({ commit, rootGetters }) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        const data = await firebase
          .database()
          .ref()
          .child(`users/${userId}`)
          .get();
        let portfolioList = {};

        if (data.val()) {
          portfolioList = data.val().portfolios;
        }

        commit("SET_PORTFOLIO", portfolioList);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async REMOVE_PORTFOLIO({ commit, rootGetters }, id) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        await firebase
          .database()
          .ref()
          .child(`users/${userId}/portfolios/${id}`)
          .remove();

        commit("REMOVE_FROM_PORTFOLIO", id);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },
  },
};
