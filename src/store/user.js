import firebase from "firebase/app";

export default {
  namespaced: true,

  state: {
    loggedIn: false,
    credentials: {},
    loading: false,
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

    SET_LOADING(state, payload) {
      state.loading = payload;
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
  },
};
