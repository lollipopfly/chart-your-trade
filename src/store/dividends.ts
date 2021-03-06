import firebase from "firebase/app";
import { Module } from "vuex";
import { prepareDividendsArray } from "@/utils/helpers";
import { RootState } from "@/types/state";
import { DividendsState, Dividend, FirebaseDividend } from "@/types/dividends";

export const dividendsInitialState = (): DividendsState => {
  return {
    list: [],
  };
};

export const dividends: Module<DividendsState, RootState> = {
  namespaced: true,

  state: dividendsInitialState(),

  mutations: {
    SET_DIVIDENDS(state, payload): void {
      state.list = payload;
    },

    PUSH_TO_DIVIDENDS(state, payload): void {
      state.list = [...state.list, payload];
    },

    UPDATE_DIVIDEND(state, payload): void {
      const list = state.list.map((item) => {
        if (item.id === payload.id) {
          item = payload.data;
        }

        return item;
      });

      state.list = list;
    },

    REMOVE_FROM_DIVIDENDS(state, payload: string): void {
      state.list = state.list.filter((item: Dividend) => item.id !== payload);
    },
  },

  actions: {
    async FETCH_DIVIDENDS({ commit, rootGetters }): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref()
          .child(`users/${userId}/dividends`)
          .get();
        const respVal = resp.val();
        let dividendsList: Dividend[] = [];

        if (respVal) {
          dividendsList = prepareDividendsArray(respVal);
        }

        commit("SET_DIVIDENDS", dividendsList);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });
      }
    },

    async ADD_DIVIDEND(
      { commit, rootGetters },
      dividend: FirebaseDividend
    ): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref(`/users/${userId}/dividends/`)
          .push(dividend);

        if (resp.key) {
          const newDividendItem: Dividend = {
            ...dividend,
            id: resp.key,
          };

          commit("PUSH_TO_DIVIDENDS", newDividendItem);
        }
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async UPDATE_DIVIDEND({ commit, rootGetters }, dividend): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

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

    async REMOVE_DIVIDEND({ commit, rootGetters }, id: string): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

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
