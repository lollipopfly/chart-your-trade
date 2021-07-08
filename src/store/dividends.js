import firebase from "firebase/app";
import Vue from "vue";

export default {
  namespaced: true,

  state: {
    list: {},
  },

  mutations: {
    SET_DIVIDENDS(state, payload) {
      state.list = payload;
    },

    PUSH_TO_DIVIDENDS(state, payload) {
      state.list = { ...state.list, [payload.key]: payload.data };
    },

    UPDATE_DIVIDEND(state, payload) {
      state.list[payload.id] = payload.data;
    },

    REMOVE_FROM_DIVIDENDS(state, payload) {
      Vue.delete(state.list, payload);
    },
  },

  actions: {
    async FETCH_DIVIDENDS({ commit, rootGetters }) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref()
          .child(`users/${userId}/dividends`)
          .get();
        let dividendsList = {};

        if (resp.val()) {
          dividendsList = resp.val();
        }

        commit("SET_DIVIDENDS", dividendsList);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });
      }
    },

    async ADD_DIVIDEND({ commit, rootGetters }, dividend) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref(`/users/${userId}/dividends/`)
          .push(dividend);

        const newDividendItem = {
          key: resp.key,
          data: dividend,
        };

        commit("PUSH_TO_DIVIDENDS", newDividendItem);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async UPDATE_DIVIDEND({ commit, rootGetters }, dividend) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        await firebase
          .database()
          .ref(`/users/${userId}/dividends/${dividend.id}`)
          .update(dividend.data);

        commit("UPDATE_DIVIDEND", dividend);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async REMOVE_DIVIDEND({ commit, rootGetters }, id) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        await firebase
          .database()
          .ref(`users/${userId}/dividends/`)
          .child(id)
          .remove();

        commit("REMOVE_FROM_DIVIDENDS", id);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },
  },
};
