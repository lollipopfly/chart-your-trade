import Vue from "vue";
import { Module } from "vuex";
import firebase from "firebase/app";
import { RootState } from "@/types/state";
import {
  PortfolioState,
  Portfolio,
  FirebasePortfolio,
  UpdatedPortfolio,
  DeletedTradeParams,
  FirebaseTrades,
  FirebaseUnformatedTrade,
  TempTradeToUpdate,
  Trade,
} from "@/types/portfolio";

function prepareTradesArray(obj: FirebaseTrades): Trade[] {
  const tempArr = Object.entries(obj);

  return tempArr.map((item: FirebaseUnformatedTrade) => {
    const id: string = item[0];
    const val = item[1];
    val["id"] = id;

    return val;
  });
}

export const portfolio: Module<PortfolioState, RootState> = {
  namespaced: true,

  state: {
    list: {},
    currentPortfolio: {
      name: "",
      trades: [],
      uid: "",
    },
  },

  mutations: {
    SET_PORTFOLIO_LIST(state, payload: FirebasePortfolio[]): void {
      state.list = payload;
    },

    SET_CURRENT_PORTFOLIO(state, payload): void {
      state.currentPortfolio = payload;

      if (typeof state.currentPortfolio.trades === "undefined") {
        state.currentPortfolio.trades = [];
      }
    },

    PUSH_TO_PORTFOLIO(state, payload: FirebasePortfolio): void {
      const keysObj = Object.keys(payload);
      const key = keysObj[0];

      state.list[key] = payload[key];
    },

    UPDATE_PORTFOLIO(state, payload: UpdatedPortfolio): void {
      state.list[payload.portfolioId]["name"] = payload.name;
    },

    REMOVE_FROM_PORTFOLIO(state, payload: string): void {
      Vue.delete(state.list, payload);
    },

    PUSH_TO_TRADES(state, payload: Trade): void {
      state.currentPortfolio.trades = [
        ...state.currentPortfolio.trades,
        payload,
      ];
    },

    UPDATE_TRADE(state, payload: TempTradeToUpdate): void {
      const trades = state.currentPortfolio.trades.map((item: Trade) => {
        if (item.id === payload.id) {
          payload.data["id"] = payload.id;
          item = payload.data;
        }

        return item;
      });

      state.currentPortfolio.trades = trades;
    },

    REMOVE_FROM_TRADES(state, payload: string): void {
      state.currentPortfolio.trades = state.currentPortfolio.trades.filter(
        (item: Trade) => item.id !== payload
      );
    },

    CLEAR_TRADES(state): void {
      state.currentPortfolio = {
        name: "",
        trades: [],
        uid: "",
      };
    },
  },

  actions: {
    async FETCH_PORTFOLIO_LIST({ commit, rootGetters }): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref()
          .child(`users/${userId}/portfolio`)
          .get();
        const respVal = resp.val();
        let portfolioList: FirebasePortfolio[] | {} = {};

        if (respVal) {
          portfolioList = respVal;
        }

        commit("SET_PORTFOLIO_LIST", portfolioList);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async FETCH_PORTFOLIO_BY_ID(
      { commit, rootGetters },
      id: string
    ): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref(`users/${userId}/portfolio/`)
          .child(id)
          .get();
        const dataVal: Portfolio = resp.val();

        if (dataVal) {
          if ("trades" in dataVal) {
            dataVal.trades = prepareTradesArray(dataVal.trades);
          }

          commit("SET_CURRENT_PORTFOLIO", dataVal);
        }
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async ADD_PORTFOLIO(
      { commit, rootGetters },
      portfolioName: string
    ): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];
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
    ): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

      try {
        const updates: Portfolio = {
          name: updatedItem.name,
        };

        await firebase
          .database()
          .ref(`/users/${userId}/portfolio/${updatedItem.portfolioId}`)
          .update(updates);

        commit("UPDATE_PORTFOLIO", updatedItem);
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async REMOVE_PORTFOLIO({ commit, rootGetters }, id: string): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

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

    async ADD_TRADE(
      { commit, rootGetters },
      trade: TempTradeToUpdate
    ): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

      try {
        const resp = await firebase
          .database()
          .ref(`/users/${userId}/portfolio/${trade.portfolioId}/trades`)
          .push(trade.data);
        const id = resp.key;

        if (id !== null) {
          const newTradeItem: Trade = {
            ...trade.data,
            id,
          };

          commit("PUSH_TO_TRADES", newTradeItem);
        }
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async UPDATE_TRADE(
      { commit, rootGetters },
      trade: TempTradeToUpdate
    ): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

      try {
        await firebase
          .database()
          .ref(
            `/users/${userId}/portfolio/${trade.portfolioId}/trades/${trade.id}`
          )
          .update(trade.data);

        if (trade.id !== undefined) {
          const updatedTrade: TempTradeToUpdate = {
            id: trade.id,
            data: trade.data,
          };

          commit("UPDATE_TRADE", updatedTrade);
        }
      } catch (error) {
        commit("SET_ERROR", error, { root: true });

        throw error;
      }
    },

    async REMOVE_TRADE(
      { commit, rootGetters },
      data: DeletedTradeParams
    ): Promise<void> {
      const userId: string = rootGetters["user/GET_USER_ID"];

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
