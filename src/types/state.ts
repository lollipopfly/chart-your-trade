export interface RootState {
  error: string | null;
}

export interface UserState {
  loggedIn: boolean;
  credentials: any;
  loading: boolean;
  profile: UserProfileState;
}

export type UserFeeState = string | null;

export interface UserProfileState {
  brokerFeePercent: UserFeeState;
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
