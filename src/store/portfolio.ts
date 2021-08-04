import Vue from "vue";
import { Module } from "vuex";
import firebase from "firebase/app";
import { RootState, PortfolioState } from "@/types/state";
import { Updates, UpdatedPortfolio } from "@/types/portfolio";

export const portfolio: Module<PortfolioState, RootState> = {
  namespaced: true,

  state: {
    list: {},
    currentPortfolio: {
      trades: {},
    },
  },

  mutations: {
    SET_PORTFOLIO_LIST(state, payload) {
      state.list = payload;
    },

    SET_CURRENT_PORTFOLIO(state, payload) {
      state.currentPortfolio = payload;

      if (typeof state.currentPortfolio.trades === "undefined") {
        state.currentPortfolio.trades = {};
      }
    },

    PUSH_TO_PORTFOLIO(state, payload) {
      const keysObj = Object.keys(payload);
      const key = keysObj[0];

      state.list[key] = payload[key];
    },

    UPDATE_PORTFOLIO(state, payload) {
      const keysObj = Object.keys(payload);
      const key = keysObj[0];

      state.list[key] = payload[key];
    },

    REMOVE_FROM_PORTFOLIO(state, payload) {
      Vue.delete(state.list, payload);
    },

    PUSH_TO_TRADES(state, payload) {
      const currentPortfolio = state.currentPortfolio;
      currentPortfolio.trades = {
        ...state.currentPortfolio.trades,
        [payload.key]: payload.data,
      };
      state.currentPortfolio = currentPortfolio;
    },

    UPDATE_TRADE(state, payload) {
      const keysObj = Object.keys(payload);
      const key = keysObj[0];

      state.currentPortfolio.trades[key] = payload[key];
    },

    REMOVE_FROM_TRADES(state, payload) {
      Vue.delete(state.currentPortfolio.trades, payload);
    },
  },

  actions: {
    async FETCH_PORTFOLIO_LIST({ commit, rootGetters }) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref()
          .child(`users/${userId}`)
          .get();
        const respVal = resp.val();
        let portfolioList = {};

        if (respVal) {
          portfolioList = respVal.portfolio;
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

    async ADD_PORTFOLIO({ commit, rootGetters }, portfolioName) {
      const userId = rootGetters["user/GET_USER_ID"];
      const params: Updates = {
        name: portfolioName,
        uid: userId,
      };

      try {
        const resp = await firebase
          .database()
          .ref(`/users/${userId}/portfolio`)
          .push(params);
        const newPortfolioItem: UpdatedPortfolio = {};
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

    async UPDATE_PORTFOLIO_NAME({ commit, rootGetters }, updatedItem) {
      const userId = rootGetters["user/GET_USER_ID"];

      try {
        const updates: Updates = {
          name: updatedItem.name,
          uid: userId,
        };

        const updatedPortfolio: UpdatedPortfolio = {};

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

    async ADD_TRADE({ commit, rootGetters }, trade) {
      const userId = rootGetters["user/GET_USER_ID"];

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
      const userId = rootGetters["user/GET_USER_ID"];
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
      const userId = rootGetters["user/GET_USER_ID"];

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
