import { UserId } from "./user";

export interface PortfolioState {
  list: any;
  currentPortfolio: {
    trades: any;
  };
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

export interface Trade {
  ticker: string;
  buyPrice: string;
  sellPrice: string;
  closeDate: number | null;
  openDate: number | null;
  comment: string;
  quantity: string;
}
