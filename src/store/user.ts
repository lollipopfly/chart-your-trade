import { Module } from "vuex";
import firebase from "firebase/app";
import {
  RootState,
  UserState,
  UserFeeState,
  UserProfileState,
} from "@/types/state";
import messages from "@/utils/messages";

export const userInitialState = (): UserState => {
  return {
    loggedIn: false,
    credentials: {},
    loading: false,
    profile: {
      brokerFeePercent: "0",
    },
  };
};

export const user: Module<UserState, RootState> = {
  namespaced: true,

  state: userInitialState(),

  mutations: {
    SET_USER(state, payload: firebase.User): void {
      state.loggedIn = true;
      state.credentials = payload;
    },

    UPDATE_USER_PROFILE(state, payload: UserProfileState): void {
      state.profile = payload;
    },

    SET_LOADING(state, payload: boolean): void {
      state.loading = payload;
    },
  },

  getters: {
    GET_USER_ID(state): string {
      return state.credentials.uid;
    },

    GET_TABLE_FEE_TOOLTIP(state): string {
      const fee: UserFeeState = state.profile.brokerFeePercent;
      let initFee: number = 0;
      let tooltipFee: string = "";

      if (fee) {
        initFee = parseFloat(fee) * 2;
        tooltipFee = initFee + "%";
      }

      const tooltipText: string = tooltipFee
        ? messages.trade["fee"] + ": " + tooltipFee
        : messages.trade["no-fee"];

      return tooltipText;
    },
  },

  actions: {
    async REGISTER({ commit }, { email, password }): Promise<void> {
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

    async LOGIN({ commit }, { email, password }): Promise<void> {
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

    async SET_USER_PROFILE(
      { commit, getters },
      profileData: UserProfileState
    ): Promise<void> {
      const userId: string = getters.GET_USER_ID;

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

    async FETCH_USER_PROFILE({ commit, getters }): Promise<void> {
      const userId: string = getters.GET_USER_ID;

      try {
        const resp = await firebase
          .database()
          .ref()
          .child(`users/${userId}/profile`)
          .get();
        const respVal: UserProfileState = resp.val();

        if (respVal) {
          commit("UPDATE_USER_PROFILE", respVal);
        }
      } catch (error) {
        commit("SET_ERROR", error, { root: true });
      }
    },
  },
};
