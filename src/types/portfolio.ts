import { UserId } from "./user";

export interface PortfolioState {
  list: any;
  currentPortfolio: Portfolio;
}

export interface FirebasePortfolio {
  [key: string]: Portfolio;
}

export interface Portfolio {
  name: string;
  trades?: any;
  uid: UserId;
}

export interface UpdatedPortfolio {
  name: string;
  portfolioId: string;
}

export type Trade = {
  id?: string;
  ticker: string;
  buyPrice: string;
  sellPrice: string;
  closeDate: number | null;
  openDate: number | null;
  comment: string;
  quantity: string;
};
export type TradeOrEmpty = Trade | {};

export interface FirebaseTrades {
  [key: string]: Trade;
}

export type FirebaseUnformatedTrade = [string, Trade];

export interface TempTradeToUpdate {
  id?: string;
  portfolioId?: string;
  data: Trade;
}

export interface DeletedTradeParams {
  id: string;
  portfolioId: string;
}
