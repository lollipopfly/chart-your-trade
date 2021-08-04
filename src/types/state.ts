export interface RootState {
  error: string | null;
}

export interface UserState {
  loggedIn: boolean;
  credentials: any;
  loading: boolean;
  profile: {
    brokerFeePercent: string; // TODO: make number
  };
}

export interface DividendsState {
  list: any;
}

export interface PortfolioState {
  list: any;
  currentPortfolio: {
    trades: any;
  };
}
