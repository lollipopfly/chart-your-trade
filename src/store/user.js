import firebase from "firebase/app";
import messages from "@/components/utils/messages";
import Vue from "vue";

export default {
  namespaced: true,

  state: {
    loggedIn: false,
    credentials: {},
    loading: false,
    profile: {
      brokerFeePercent: 0,
    },
  },

  mutations: {
    SET_USER(state, payload) {
      state.loggedIn = true;
      state.credentials = payload;
    },

    CLEAR_USER(state) {
      state.loggedIn = false;
      state.credentials = {};
    },

    UPDATE_USER_PROFILE(state, payload) {
      state.profile = payload;
    },

    SET_LOADING(state, payload) {
      state.loading = payload;
    },
  },

  getters: {
    GET_USER_ID(state) {
      return state.credentials.uid;
    },

    GET_TABLE_FEE_TOOLTIP(state) {
      const vm = new Vue();

      const fee = state.profile.brokerFeePercent;
      let tradeFee = parseFloat(fee) * 2;
      tradeFee = vm.$options.filters.currency(tradeFee);

      const tooltipText = fee
        ? messages.trade["fee"] + ": " + tradeFee
        : messages.trade["no-fee"];

      return tooltipText;
    },
  },

  actions: {
    async REGISTER({ commit }, { email, password }) {
      try {
        commit("SET_LOADING", true);
        const user = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);

        commit("SET_USER", user.user);
        commit("SET_LOADING", false);
      } catch (error) {
        commit("SET_LOADING", false);
        throw error;
      }
    },

    async LOGIN({ commit }, { email, password }) {
      try {
        commit("SET_LOADING", true);
        const user = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);

        commit("SET_USER", user.user);
        commit("SET_LOADING", false);
      } catch (error) {
        commit("SET_LOADING", false);

        throw error;
      }
    },

    async LOGOUT({ commit }) {
      await firebase.auth().signOut();

      commit("CLEAR_USER");
    },

    async SET_USER_PROFILE({ commit, getters }, profileData) {
      const userId = getters.GET_USER_ID;

      try {
        await firebase
          .database()
          .ref(`/users/${userId}/profile/`)
          .update(profileData);

        commit("UPDATE_USER_PROFILE", profileData);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async FETCH_USER_PROFILE({ commit, getters }) {
      const userId = getters.GET_USER_ID;

      try {
        const resp = await firebase
          .database()
          .ref()
          .child(`users/${userId}/profile`)
          .get();
        const respVal = resp.val();

        if (respVal) {
          commit("UPDATE_USER_PROFILE", respVal);
        }
      } catch (error) {
        commit("SET_ERROR", error, { root: true });
      }
    },
  },
};
