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
  uid: string;
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

export interface FirebaseTrades {
  [key: string]: Trade;
}

export type FirebaseUnformatedTrade = [string, Trade];

export type Profit = number | null;

export interface TempTradeToUpdate {
  id?: string;
  portfolioId?: string;
  data: Trade;
}

export interface DeletedTradeParams {
  id: string;
  portfolioId: string;
}
