export interface PortfolioState {
  list: PortfolioList;
  currentPortfolio: Portfolio;
}

export interface PortfolioList {
  [key: string]: Portfolio;
}

export interface Portfolio {
  name: string;
  trades?: Trade[];
  uid?: string;
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
