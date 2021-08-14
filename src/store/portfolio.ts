import Vue from "vue";
import { Module } from "vuex";
import firebase from "firebase/app";
import { RootState } from "@/types/state";
import {
  PortfolioState,
  Portfolio,
  FirebasePortfolio,
  UpdatedPortfolio,
} from "@/types/portfolio";
import { UserId } from "@/types/user";

export const portfolio: Module<PortfolioState, RootState> = {
  namespaced: true,

  state: {
    list: {},
    currentPortfolio: {
      trades: {},
    },
  },

  mutations: {
    SET_PORTFOLIO_LIST(state, payload: FirebasePortfolio[]): void {
      state.list = payload;
    },

    SET_CURRENT_PORTFOLIO(state, payload): void {
      state.currentPortfolio = payload;

      if (typeof state.currentPortfolio.trades === "undefined") {
        state.currentPortfolio.trades = {};
      }
    },

    PUSH_TO_PORTFOLIO(state, payload: FirebasePortfolio): void {
      const keysObj = Object.keys(payload);
      const key = keysObj[0];

      state.list[key] = payload[key];
    },

    UPDATE_PORTFOLIO(state, payload: FirebasePortfolio): void {
      const keysObj = Object.keys(payload);
      const key = keysObj[0];

      state.list[key] = payload[key];
    },

    REMOVE_FROM_PORTFOLIO(state, payload: string): void {
      Vue.delete(state.list, payload);
    },

    PUSH_TO_TRADES(state, payload): void {
      const currentPortfolio = state.currentPortfolio;
      currentPortfolio.trades = {
        ...state.currentPortfolio.trades,
        [payload.key]: payload.data,
      };
      state.currentPortfolio = currentPortfolio;
    },

    UPDATE_TRADE(state, payload): void {
      const keysObj = Object.keys(payload);
      const key = keysObj[0];

      state.currentPortfolio.trades[key] = payload[key];
    },

    REMOVE_FROM_TRADES(state, payload): void {
      Vue.delete(state.currentPortfolio.trades, payload);
    },
  },

  actions: {
    async FETCH_PORTFOLIO_LIST({ commit, rootGetters }) {
      const userId: UserId = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref()
          .child(`users/${userId}/portfolio`)
          .get();
        const respVal = resp.val();
        let portfolioList: FirebasePortfolio[] = [];

        if (respVal) {
          portfolioList = respVal;
        }

        commit("SET_PORTFOLIO_LIST", portfolioList);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async FETCH_PORTFOLIO_BY_ID({ commit, rootGetters }, id) {
      const userId: UserId = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref(`users/${userId}/portfolio/`)
          .child(id)
          .get();
        const dataVal = resp.val();

        if (dataVal) {
          commit("SET_CURRENT_PORTFOLIO", dataVal);
        }
        return dataVal;
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async ADD_PORTFOLIO({ commit, rootGetters }, portfolioName: string) {
      const userId: UserId = rootGetters["user/GET_USER_ID"];
      const params: Portfolio = {
        name: portfolioName,
        uid: userId,
      };

      try {
        const resp = await firebase
          .database()
          .ref(`/users/${userId}/portfolio`)
          .push(params);
        const newPortfolioItem: FirebasePortfolio = {};
        const key = resp.key;

        if (key) {
          newPortfolioItem[key] = params;

          commit("PUSH_TO_PORTFOLIO", newPortfolioItem);
        }
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async UPDATE_PORTFOLIO_NAME(
      { commit, rootGetters },
      updatedItem: UpdatedPortfolio
    ) {
      const userId: UserId = rootGetters["user/GET_USER_ID"];

      try {
        const updates: Portfolio = {
          name: updatedItem.name,
          uid: userId,
        };
        const updatedPortfolio: FirebasePortfolio = {};

        updatedPortfolio[updatedItem.portfolioId] = updates;

        await firebase
          .database()
          .ref(`/users/${userId}/portfolio/${updatedItem.portfolioId}`)
          .update(updates);

        commit("UPDATE_PORTFOLIO", updatedPortfolio);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async REMOVE_PORTFOLIO({ commit, rootGetters }, id: string) {
      const userId: UserId = rootGetters["user/GET_USER_ID"];

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

    async ADD_TRADE({ commit, rootGetters }, trade) {
      const userId: UserId = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref(`/users/${userId}/portfolio/${trade.portfolioId}/trades`)
          .push(trade.data);
        const newTradeItem = {
          key: resp.key,
          data: trade.data,
        };

        commit("PUSH_TO_TRADES", newTradeItem);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async UPDATE_TRADE({ commit, rootGetters }, trade) {
      const userId: UserId = rootGetters["user/GET_USER_ID"];
      const updatedTrade: any = {};

      updatedTrade[trade.id] = trade.data;

      try {
        await firebase
          .database()
          .ref(
            `/users/${userId}/portfolio/${trade.portfolioId}/trades/${trade.id}`
          )
          .update(trade.data);

        commit("UPDATE_TRADE", updatedTrade);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async REMOVE_TRADE({ commit, rootGetters }, data) {
      const userId: UserId = rootGetters["user/GET_USER_ID"];

      try {
        await firebase
          .database()
          .ref(`users/${userId}/portfolio/${data.portfolioId}/trades`)
          .child(data.id)
          .remove();

        commit("REMOVE_FROM_TRADES", data.id);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },
  },
};
