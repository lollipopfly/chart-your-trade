export interface RootState {
  error: string | null;
}

export interface UserState {
  loggedIn: boolean;
  credentials: any;
  loading: boolean;
  profile: {
    brokerFeePercent: string | null;
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

export interface State extends RootState {
  user: UserState;
  dividends: DividendsState;
  portfolio: PortfolioState;
}
