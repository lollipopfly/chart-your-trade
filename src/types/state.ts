import { DividendsState } from "./dividends";
import { PortfolioState } from "./portfolio";

export interface RootState {
  error: string | null;
}

export interface UserState {
  loggedIn: boolean;
  credentials: any;
  loading: boolean;
  profile: UserProfileState;
}

export interface UserProfileState {
  brokerFeePercent: UserFeeState;
}

export type UserFeeState = string | null;

export interface State extends RootState {
  user: UserState;
  dividends: DividendsState;
  portfolio: PortfolioState;
}
