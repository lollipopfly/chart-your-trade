import Vue from "vue";
import firebase from "firebase/app";

export default {
  namespaced: true,

  state: {
    list: {},
    currentPortfolio: false,
  },

  mutations: {
    SET_PORTFOLIO_LIST(state, payload) {
      state.list = payload;
    },

    SET_CURRENT_PORTFOLIO(state, payload) {
      state.currentPortfolio = payload;
    },

    PUSH_TO_PORTFOLIO(state, payload) {
      const key = Object.keys(payload);

      state.list[key] = payload[key];
    },

    UPDATE_PORTFOLIO(state, payload) {
      const key = Object.keys(payload);

      state.list[key] = payload[key];
    },

    REMOVE_FROM_PORTFOLIO(state, payload) {
      Vue.delete(state.list, payload);
    },
  },

  actions: {
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
          portfolioList = data.val().portfolio;
        }

        commit("SET_PORTFOLIO_LIST", portfolioList);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async FETCH_PORTFOLIO_BY_ID({ commit, rootGetters }, id) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        const data = await firebase
          .database()
          .ref(`users/${userId}/portfolio/`)
          .child(id)
          .get();
        const dataVal = data.val();

        if (dataVal) {
          commit("SET_CURRENT_PORTFOLIO", dataVal);
        }
        return dataVal;
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async ADD_PORTFOLIO({ commit, rootGetters }, portfolioName) {
      const userId = rootGetters["user/GET_USER_ID"];
      const params = {
        name: portfolioName,
        uid: userId,
      };

      try {
        const data = await firebase
          .database()
          .ref(`/users/${userId}/portfolio`)
          .push(params);
        const newPortfolioItem = {};
        newPortfolioItem[data.key] = params;

        commit("PUSH_TO_PORTFOLIO", newPortfolioItem);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async UPDATE_PORTFOLIO_NAME({ commit, rootGetters }, updatedItem) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        const updates = {
          name: updatedItem.name,
          uid: userId,
        };
        let updatedPortfolio = {};
        updatedPortfolio[updatedItem.id] = updates;

        await firebase
          .database()
          .ref(`/users/${userId}/portfolio/${updatedItem.id}`)
          .update(updates);

        commit("UPDATE_PORTFOLIO", updatedPortfolio);
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
          .child(`users/${userId}/portfolio/${id}`)
          .remove();

        commit("REMOVE_FROM_PORTFOLIO", id);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },
  },
};
