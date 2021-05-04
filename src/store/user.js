import firebase from "firebase/app";

export default {
  namespaced: true,

  state: {
    auth: false,
    credentials: {},
    loading: false,
  },

  mutations: {
    LOGIN(state, payload) {
      state.auth = true;
      state.credentials = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
  },

  actions: {
    async REGISTER({ commit }, { email, password }) {
      try {
        commit("SET_LOADING", true);
        await firebase.auth().createUserWithEmailAndPassword(email, password);
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

        commit("LOGIN", user);
        commit("SET_LOADING", false);
      } catch (error) {
        commit("SET_LOADING", false);

        throw error;
      }
    },
  },
};
